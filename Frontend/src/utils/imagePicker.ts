import { PermissionsAndroid, Platform, Alert } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { ReportImage } from '../types/report';

/**
 * Request camera permission on Android devices
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'Field Reports needs access to your camera to capture report photos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Camera permission request error:', err);
    return false;
  }
};

/**
 * Open camera to take a photo
 */
export const captureImageWithCamera = async (): Promise<ReportImage | null> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
    return null;
  }

  const options: CameraOptions = {
    mediaType: 'photo',
    saveToPhotos: false,
    quality: 0.8,
  };

  try {
    const response = await launchCamera(options);

    if (response.didCancel) {
      return null;
    }

    if (response.errorMessage) {
      Alert.alert('Error', response.errorMessage);
      return null;
    }

    const asset = response.assets?.[0];
    if (!asset || !asset.uri) {
      return null;
    }

    return {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      uri: asset.uri,
      fileName: asset.fileName || 'camera_photo.jpg',
      fileSize: asset.fileSize,
    };
  } catch (error) {
    console.error('Error capturing image:', error);
    Alert.alert('Error', 'Failed to open camera.');
    return null;
  }
};

/**
 * Open gallery to pick one or more images up to allowed limit
 */
export const pickImagesFromGallery = async (
  maxSelection: number
): Promise<ReportImage[]> => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    selectionLimit: maxSelection,
    quality: 0.8,
  };

  try {
    const response = await launchImageLibrary(options);

    if (response.didCancel) {
      return [];
    }

    if (response.errorMessage) {
      Alert.alert('Error', response.errorMessage);
      return [];
    }

    if (!response.assets || response.assets.length === 0) {
      return [];
    }

    return response.assets
      .filter((asset) => !!asset.uri)
      .map((asset, index) => ({
        id: `img_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`,
        uri: asset.uri as string,
        fileName: asset.fileName || `gallery_image_${index + 1}.jpg`,
        fileSize: asset.fileSize,
      }));
  } catch (error) {
    console.error('Error picking images:', error);
    Alert.alert('Error', 'Failed to open gallery.');
    return [];
  }
};
