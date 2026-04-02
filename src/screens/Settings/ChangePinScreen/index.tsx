import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTitleHeader } from '../../../components';
import { useThemedStyles } from '../../../theme';
import { strings } from '../../../utils/strings';
import { useChangePinScreen } from './ChangePinScreen.hook';
import { createStyles } from './styles';

type PinStep = 'verify' | 'create' | 'confirm';

type ChangePinScreenProps = {
  onBack?: () => void;
};

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['placeholder', '0', 'delete'],
] as const;

const getStepCopy = (step: PinStep) => {
  if (step === 'verify') {
    return {
      title: strings.settings.appPasscodePinVerifyTitle,
      subtitle: strings.settings.appPasscodePinVerifySubtitle,
    };
  }

  if (step === 'confirm') {
    return {
      title: strings.settings.appPasscodePinConfirmTitle,
      subtitle: strings.settings.appPasscodePinConfirmSubtitle,
    };
  }

  return {
    title: strings.settings.appPasscodePinCreateTitle,
    subtitle: strings.settings.appPasscodePinCreateSubtitle,
  };
};

const ChangePinScreen = ({ onBack }: ChangePinScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const {
    pinStep,
    enteredPin,
    pinError,
    progressIndex,
    progressTotal,
    handlePinDigitPress,
    handlePinDelete,
  } = useChangePinScreen(onBack);
  const copy = getStepCopy(pinStep);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.content}>
        <BackTitleHeader
          title={strings.settings.appPasscodeOpenUpdateAction}
          onBack={onBack}
        />

        <View style={styles.progressRow}>
          {Array.from({ length: progressTotal }).map((_, index) => (
            <View
              key={`progress-${index + 1}`}
              style={[
                styles.progressBar,
                index <= progressIndex ? styles.progressBarActive : null,
              ]}
            />
          ))}
        </View>

        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>

        <View style={styles.dotsRow}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={`dot-${index + 1}`}
              style={[styles.dot, index < enteredPin.length ? styles.dotActive : null]}
            />
          ))}
        </View>

        <View style={styles.helperCard}>
          <View style={styles.helperIconWrap}>
            <Text style={styles.helperIcon}>🛡️</Text>
          </View>
          <View style={styles.helperTextWrap}>
            <Text style={styles.helperTitle}>{strings.settings.appPasscodeSecurityCardTitle}</Text>
            <Text style={styles.helperSubtitle}>{strings.settings.appPasscodeSecurityCardSubtitle}</Text>
          </View>
        </View>

        {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}

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
                      onPress={handlePinDelete}
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
                    onPress={() => handlePinDigitPress(cell)}
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
  );
};

export default ChangePinScreen;
