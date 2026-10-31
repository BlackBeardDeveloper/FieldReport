import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ReportImage } from '../types/report';
import { useReports } from '../context/ReportsContext';
import { Button } from '../components/Button';
import { ImagePreview } from '../components/ImagePreview';
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

  // Handle taking a photo with the device camera
  const handleCameraCapture = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('Limit Reached', `You can attach a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const capturedImage = await captureImageWithCamera();
    if (capturedImage) {
      setImages((prev) => [...prev, capturedImage]);
      setImageError(null);
    }
  };

  // Handle picking one or more images from the photo gallery
  const handleGalleryPick = async () => {
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      Alert.alert('Limit Reached', `You can attach a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const pickedImages = await pickImagesFromGallery(remainingSlots);
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

      Alert.alert(
        'Report Saved',
        'Your report has been saved locally as Pending and queued for future upload.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to save report:', error);
      Alert.alert('Error', 'An unexpected error occurred while saving the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
                title="📷 Camera"
                variant="outline"
                onPress={handleCameraCapture}
                style={styles.pickerButton}
                disabled={images.length >= MAX_IMAGES}
              />
              <View style={styles.buttonSpacer} />
              <Button
                title="🖼️ Gallery"
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
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  requiredAsterisk: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  imageCountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ruleNote: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  textArea: {
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
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 6,
  },
  helperText: {
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
    fontSize: 12,
    fontWeight: '600',
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
