import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { RootStackParamList, ReportImage } from '../types/report';
import { useReports } from '../context/ReportsContext';
import { Button } from '../components/Button';
import { ImagePreview } from '../components/ImagePreview';
import { ConfirmDialog, DialogType } from '../components/ConfirmDialog';
import { fontFamily } from '../theme/typography';
import {
  captureImageWithCamera,
  pickImagesFromGallery,
} from '../utils/imagePicker';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateReport'>;

const MIN_IMAGES = 1;
const MAX_IMAGES = 5;

export const CreateReportScreen: React.FC<Props> = ({ navigation }) => {
  const { addReport } = useReports();

  const [description, setDescription] = useState('');
  const [images, setImages] = useState<ReportImage[]>([]);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: DialogType;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showDialogError = (title: string, message: string) => {
    setDialog({
      visible: true,
      title,
      message,
      type: 'danger',
      confirmText: 'OK',
      showCancel: false,
      onConfirm: () => setDialog((prev) => ({ ...prev, visible: false })),
    });
  };

  // Handle taking a photo with the device camera
  const handleCameraCapture = async () => {
    if (images.length >= MAX_IMAGES) {
      setDialog({
        visible: true,
        title: 'Limit Reached',
        message: `You can attach a maximum of ${MAX_IMAGES} images per report.`,
        type: 'warning',
        confirmText: 'Got It',
        showCancel: false,
        onConfirm: () => setDialog((prev) => ({ ...prev, visible: false })),
      });
      return;
    }

    const capturedImage = await captureImageWithCamera(showDialogError);
    if (capturedImage) {
      setImages((prev) => [...prev, capturedImage]);
      setImageError(null);
    }
  };

  // Handle picking one or more images from the photo gallery
  const handleGalleryPick = async () => {
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setDialog({
        visible: true,
        title: 'Limit Reached',
        message: `You can attach a maximum of ${MAX_IMAGES} images per report.`,
        type: 'warning',
        confirmText: 'Got It',
        showCancel: false,
        onConfirm: () => setDialog((prev) => ({ ...prev, visible: false })),
      });
      return;
    }

    const pickedImages = await pickImagesFromGallery(remainingSlots, showDialogError);
    if (pickedImages.length > 0) {
      setImages((prev) => [...prev, ...pickedImages].slice(0, MAX_IMAGES));
      setImageError(null);
    }
  };

  // Remove a selected image
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Validate inputs and create report
  const handleSubmit = () => {
    let isValid = true;

    // Validate description
    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      setDescriptionError('Description is required.');
      isValid = false;
    } else {
      setDescriptionError(null);
    }

    // Validate image count
    if (images.length < MIN_IMAGES) {
      setImageError(`Please attach at least ${MIN_IMAGES} photo.`);
      isValid = false;
    } else if (images.length > MAX_IMAGES) {
      setImageError(`Maximum ${MAX_IMAGES} photos allowed.`);
      isValid = false;
    } else {
      setImageError(null);
    }

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save report into in-memory store
      addReport(trimmedDesc, images);

      setDialog({
        visible: true,
        title: 'Report Created Successfully',
        message: 'Your field report has been saved locally as Pending and queued for upload.',
        type: 'success',
        confirmText: 'Go to Dashboard',
        showCancel: false,
        onConfirm: () => {
          setDialog((prev) => ({ ...prev, visible: false }));
          navigation.goBack();
        },
      });
    } catch (error) {
      console.error('Failed to save report:', error);
      setDialog({
        visible: true,
        title: 'Save Failed',
        message: 'An unexpected error occurred while saving the report.',
        type: 'danger',
        confirmText: 'Dismiss',
        showCancel: false,
        onConfirm: () => setDialog((prev) => ({ ...prev, visible: false })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPress = () => {
    if (description.trim().length > 0 || images.length > 0) {
      setDialog({
        visible: true,
        title: 'Discard Report?',
        message: 'You have unsaved changes. Are you sure you want to discard this report and return to the dashboard?',
        type: 'warning',
        confirmText: 'Discard',
        cancelText: 'Keep Editing',
        showCancel: true,
        onConfirm: () => {
          setDialog((prev) => ({ ...prev, visible: false }));
          navigation.goBack();
        },
        onCancel: () => setDialog((prev) => ({ ...prev, visible: false })),
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card: Report Description */}
          <View style={styles.sectionCard}>
            <View style={styles.labelRow}>
              <Text style={styles.sectionLabel}>Report Description</Text>
              <Text style={styles.requiredAsterisk}>* Required</Text>
            </View>

            <TextInput
              style={[
                styles.textArea,
                descriptionError ? styles.inputErrorBorder : null,
              ]}
              placeholder="Provide a detailed description of the field observation, safety concern, or inspection finding..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (descriptionError && text.trim()) {
                  setDescriptionError(null);
                }
              }}
            />

            {descriptionError && (
              <Text style={styles.errorText}>{descriptionError}</Text>
            )}
            <Text style={styles.helperText}>
              Characters: {description.trim().length}
            </Text>
          </View>

          {/* Card: Attached Images */}
          <View style={styles.sectionCard}>
            <View style={styles.labelRow}>
              <Text style={styles.sectionLabel}>Evidence Photos</Text>
              <Text style={styles.imageCountBadge}>
                {images.length} of {MAX_IMAGES} selected
              </Text>
            </View>

            <Text style={styles.ruleNote}>
              Minimum {MIN_IMAGES} photo required, maximum {MAX_IMAGES} photos.
            </Text>

            {/* Action buttons for Camera and Gallery */}
            <View style={styles.pickerButtonsRow}>
              <Button
                title="Camera"
                icon={<Camera size={16} color="#1E40AF" strokeWidth={2.2} />}
                variant="outline"
                onPress={handleCameraCapture}
                style={styles.pickerButton}
                disabled={images.length >= MAX_IMAGES}
              />
              <View style={styles.buttonSpacer} />
              <Button
                title="Gallery"
                icon={<ImageIcon size={16} color="#1E40AF" strokeWidth={2.2} />}
                variant="outline"
                onPress={handleGalleryPick}
                style={styles.pickerButton}
                disabled={images.length >= MAX_IMAGES}
              />
            </View>

            {/* Image Previews */}
            {images.length > 0 ? (
              <View style={styles.previewContainer}>
                <Text style={styles.previewHeaderTitle}>Selected Photos:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.imagesRow}>
                    {images.map((img, index) => (
                      <ImagePreview
                        key={img.id}
                        image={img}
                        index={index}
                        onRemove={() => handleRemoveImage(index)}
                        showRemoveButton={true}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : (
              <View style={styles.noImagesBox}>
                <Text style={styles.noImagesText}>
                  No photos selected yet. Use Camera or Gallery to attach photos.
                </Text>
              </View>
            )}

            {imageError && <Text style={styles.errorText}>{imageError}</Text>}
          </View>

          {/* Submit Action */}
          <View style={styles.submitSection}>
            <Button
              title="Save Field Report"
              variant="primary"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.submitButton}
            />

            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleCancelPress}
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Professional Confirmation Dialog */}
      <ConfirmDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        showCancel={dialog.showCancel}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel || (() => setDialog((prev) => ({ ...prev, visible: false })))}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: '#1E293B',
  },
  requiredAsterisk: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: '#DC2626',
  },
  imageCountBadge: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ruleNote: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  textArea: {
    fontFamily: fontFamily.regular,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 110,
  },
  inputErrorBorder: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: '#DC2626',
    marginTop: 6,
  },
  helperText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right',
  },
  pickerButtonsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 10,
  },
  buttonSpacer: {
    width: 10,
  },
  previewContainer: {
    marginTop: 8,
  },
  previewHeaderTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: '#475569',
    marginBottom: 8,
  },
  imagesRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  noImagesBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  noImagesText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  submitSection: {
    marginTop: 8,
  },
  submitButton: {
    marginBottom: 10,
    elevation: 2,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
