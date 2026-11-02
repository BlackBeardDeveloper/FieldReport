import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
  X,
} from 'lucide-react-native';
import { fontFamily } from '../theme/typography';
import { Button } from './Button';

export type DialogType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  showCancel = true,
  onConfirm,
  onCancel,
}) => {
  const getIconConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 size={24} color="#DC2626" strokeWidth={2.2} />,
          bg: '#FEE2E2',
          border: '#FECACA',
          buttonVariant: 'danger' as const,
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={24} color="#D97706" strokeWidth={2.2} />,
          bg: '#FEF3C7',
          border: '#FDE68A',
          buttonVariant: 'primary' as const,
        };
      case 'success':
        return {
          icon: <CheckCircle2 size={24} color="#059669" strokeWidth={2.2} />,
          bg: '#D1FAE5',
          border: '#A7F3D0',
          buttonVariant: 'primary' as const,
        };
      case 'info':
      default:
        return {
          icon: <Info size={24} color="#2563EB" strokeWidth={2.2} />,
          bg: '#EFF6FF',
          border: '#BFDBFE',
          buttonVariant: 'primary' as const,
        };
    }
  };

  const config = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={showCancel && onCancel ? onCancel : undefined}
      >
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Close button top right if cancelable */}
          {showCancel && onCancel && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onCancel}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {/* Type Icon Badge */}
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: config.bg, borderColor: config.border },
            ]}
          >
            {config.icon}
          </View>

          {/* Dialog Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Dialog Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            {showCancel && onCancel && (
              <Button
                title={cancelText}
                variant="secondary"
                onPress={onCancel}
                style={styles.cancelButton}
              />
            )}
            <Button
              title={confirmText}
              variant={config.buttonVariant}
              onPress={onConfirm}
              style={[
                styles.confirmButton,
                !showCancel && styles.fullWidthButton,
              ]}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    borderRadius: 12,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  message: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  confirmButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
    width: '100%',
  },
});
