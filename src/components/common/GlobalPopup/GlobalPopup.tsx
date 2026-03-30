import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemedStyles } from '../../../theme';
import { createStyles } from './styles';

type GlobalPopupProps = {
  visible: boolean;
  title: string;
  message?: string;
  buttonLabel: string;
  onClose: () => void;
};

export const GlobalPopup = ({
  visible,
  title,
  message,
  buttonLabel,
  onClose,
}: GlobalPopupProps) => {
  const styles = useThemedStyles(createStyles);

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{buttonLabel}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
