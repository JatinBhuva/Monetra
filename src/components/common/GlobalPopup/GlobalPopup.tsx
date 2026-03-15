import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { styles } from './styles';

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
  if (!visible) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
