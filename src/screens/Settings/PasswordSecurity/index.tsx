import React, { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  AppPasscodeGate,
  BackTitleHeader,
  PrimaryActionButton,
} from '../../../components';
import { spacing, useAppTheme, useThemedStyles } from '../../../theme';
import type { LoggedInStackParamList } from '../../../types';
import { ScreenConstants } from '../../../utils/constants';
import { strings } from '../../../utils/strings';
import { usePasswordSecurity } from './PasswordSecurity.hook';
import { createStyles } from './styles';

type PasswordSecurityScreenProps = {
  onBack?: () => void;
};

const PasswordSecurityScreen = ({ onBack }: PasswordSecurityScreenProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomSpacing = insets.bottom + spacing.lg;
  const [isDisableGateVisible, setIsDisableGateVisible] = useState(false);
  const {
    isLoading,
    isEnabled,
    isPasscodeSwitchOn,
    handlePasscodeToggle,
    verifyPasscode,
    disablePasscodeWithVerification,
  } = usePasswordSecurity();
  const passcodeActionLabel = isEnabled
    ? strings.settings.appPasscodeOpenUpdateAction
    : strings.settings.appPasscodeOpenSetupAction;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerWrap}>
        <BackTitleHeader
          title={strings.settings.passwordSecurityScreenTitle}
          onBack={onBack}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomSpacing }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{strings.settings.appPasscodeSectionTitle}</Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.appPasscodeSectionDescription}
          </Text>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{strings.settings.appPasscodeToggleLabel}</Text>
            <Text style={styles.toggleValue}>
              {isPasscodeSwitchOn
                ? strings.settings.appPasscodeStatusOn
                : strings.settings.appPasscodeStatusOff}
            </Text>
            <Switch
              value={isPasscodeSwitchOn}
              onValueChange={nextValue =>
                handlePasscodeToggle(
                  nextValue,
                  () => {
                    navigation.navigate(ScreenConstants.CHANGE_PIN_SCREEN);
                  },
                  () => {
                    setIsDisableGateVisible(true);
                  },
                )
              }
              disabled={isLoading || isDisableGateVisible}
              trackColor={{
                false: colors.border,
                true: colors.successSoft,
              }}
              thumbColor={isPasscodeSwitchOn ? colors.successBright : colors.surface}
            />
          </View>

          {isPasscodeSwitchOn ? (
            <>
              <PrimaryActionButton
                label={passcodeActionLabel}
                onPress={() => navigation.navigate(ScreenConstants.CHANGE_PIN_SCREEN)}
                style={styles.button}
              />
            </>
          ) : null}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{strings.settings.accountPasswordSectionTitle}</Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.accountPasswordSectionDescription}
          </Text>
          <PrimaryActionButton
            label={strings.settings.accountPasswordOpenModalAction}
            onPress={() =>
              navigation.navigate(ScreenConstants.CHANGE_PASSWORD_SCREEN)
            }
            style={styles.button}
          />
        </View>
      </ScrollView>
      <AppPasscodeGate
        visible={isDisableGateVisible}
        onVerify={verifyPasscode}
        onUnlock={() => {
          disablePasscodeWithVerification().then(isDisabled => {
            if (isDisabled) {
              setIsDisableGateVisible(false);
            }
          });
        }}
        title={strings.settings.appPasscodeDisableVerificationTitle}
        subtitle={strings.settings.appPasscodeDisableVerificationSubtitle}
        invalidPasscodeError={strings.settings.appPasscodeCurrentIncorrectError}
        cancelLabel={strings.settings.appPasscodeDisableCancelAction}
        onCancel={() => setIsDisableGateVisible(false)}
      />
    </SafeAreaView>
  );
};

export default PasswordSecurityScreen;
