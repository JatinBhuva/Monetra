import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemedStyles } from '../../../theme';
import { strings } from '../../../utils/strings';
import { createStyles } from './styles';

type AppPasscodeGateProps = {
  visible: boolean;
  onVerify: (passcode: string) => boolean;
  onUnlock: () => void;
  title?: string;
  subtitle?: string;
  invalidPasscodeError?: string;
  onCancel?: () => void;
  cancelLabel?: string;
};

const AppPasscodeGate = ({
  visible,
  onVerify,
  onUnlock,
  title,
  subtitle,
  invalidPasscodeError,
  onCancel,
  cancelLabel,
}: AppPasscodeGateProps) => {
  const styles = useThemedStyles(createStyles);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      setInput('');
      setError('');
    }
  }, [visible]);

  const handleDigitPress = (digit: string) => {
    if (input.length >= 4) {
      return;
    }

    const next = `${input}${digit}`;
    setInput(next);

    if (error) {
      setError('');
    }

    if (next.length === 4) {
      if (!onVerify(next)) {
        setError(invalidPasscodeError ?? strings.settings.appLockInvalidError);
        setInput('');
        return;
      }

      setInput('');
      setError('');
      onUnlock();
    }
  };

  const handleDelete = () => {
    if (input.length === 0) {
      return;
    }

    setInput(prev => prev.slice(0, -1));
    if (error) {
      setError('');
    }
  };

  const KEYPAD_ROWS = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['placeholder', '0', 'delete'],
  ] as const;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <SafeAreaView edges={['top', 'bottom']} style={styles.overlay}>
        <View style={styles.backgroundGlowTop} />
        <View style={styles.backgroundGlowBottom} />

        <View style={styles.content}>
          {onCancel ? (
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>
                {cancelLabel ?? strings.settings.appPasscodeDisableCancelAction}
              </Text>
            </Pressable>
          ) : null}
          <View style={styles.progressRow}>
            <View style={styles.progressBar} />
          </View>

          <Text style={styles.title}>{title ?? strings.settings.appLockTitle}</Text>
          <Text style={styles.subtitle}>{subtitle ?? strings.settings.appLockSubtitle}</Text>

          <View style={styles.dotsRow}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View
                key={`dot-${index + 1}`}
                style={[styles.dot, index < input.length ? styles.dotActive : null]}
              />
            ))}
          </View>

          <View style={styles.helperCard}>
            <View style={styles.helperIconWrap}>
              <Text style={styles.helperIcon}>🛡️</Text>
            </View>
            <View style={styles.helperTextWrap}>
              <Text style={styles.helperTitle}>
                {strings.settings.appPasscodeSecurityCardTitle}
              </Text>
              <Text style={styles.helperSubtitle}>
                {strings.settings.appPasscodeSecurityCardSubtitle}
              </Text>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.keypadWrap}>
            {KEYPAD_ROWS.map((row, rowIndex) => (
              <View key={`row-${rowIndex + 1}`} style={styles.keypadRow}>
                {row.map(cell => {
                  if (cell === 'placeholder') {
                    return <View key={`placeholder-${rowIndex}`} style={styles.keyButton} />;
                  }

                  if (cell === 'delete') {
                    return (
                      <Pressable
                        key="delete"
                        onPress={handleDelete}
                        style={({ pressed }) => [
                          styles.keyButton,
                          pressed ? styles.keyButtonPressed : null,
                        ]}
                      >
                        <Text style={styles.keyMetaSingle}>⌫</Text>
                      </Pressable>
                    );
                  }

                  return (
                    <Pressable
                      key={cell}
                      onPress={() => handleDigitPress(cell)}
                      style={({ pressed }) => [
                        styles.keyButton,
                        pressed ? styles.keyButtonPressed : null,
                      ]}
                    >
                      <Text style={styles.keyNumber}>{cell}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AppPasscodeGate;
