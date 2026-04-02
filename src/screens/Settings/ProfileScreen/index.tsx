import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackTitleHeader, PrimaryActionButton } from '../../../components';
import { spacing, useAppTheme, useThemedStyles } from '../../../theme';
import { strings } from '../../../utils/strings';
import { useProfileScreen } from './ProfileScreen.hook';
import { createStyles } from './styles';

type ProfileScreenProps = {
  onBack?: () => void;
};

const ProfileScreen = ({ onBack }: ProfileScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const {
    fullName,
    email,
    phone,
    memberSinceYear,
    initials,
    isLoading,
    isSaving,
    error,
    setFullName,
    setPhone,
    saveProfile,
  } = useProfileScreen();

  const bottomSpacing = insets.bottom + spacing.s20;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.headerWrap}>
        <BackTitleHeader
          title={strings.settings.profileScreenTitle}
          onBack={onBack}
        />
      </View>

      {isLoading ? (
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.successBright} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottomSpacing }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <Text style={styles.memberSince}>
              {`${strings.settings.profileMemberSincePrefix} ${memberSinceYear}`}
            </Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>{strings.settings.profileFullNameLabel}</Text>
            <TextInput
              value={fullName}
              onChangeText={text => {
                setFullName(text);
              }}
              placeholder={strings.settings.profileFullNamePlaceholder}
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>{strings.settings.profileEmailLabel}</Text>
            <TextInput
              value={email}
              placeholder={strings.settings.profileEmailPlaceholder}
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
              selectTextOnFocus={false}
              style={[styles.input, styles.inputReadonly]}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>{strings.settings.profilePhoneLabel}</Text>
            <TextInput
              value={phone}
              onChangeText={text => {
                setPhone(text);
              }}
              placeholder={strings.settings.profilePhonePlaceholder}
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.securityCard}>
            <View style={styles.securityIconWrap}>
              <Text style={styles.securityIcon}>ID</Text>
            </View>
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>{strings.settings.profileVerificationTitle}</Text>
              <Text style={styles.securityDescription}>
                {strings.settings.profileVerificationDescription}
              </Text>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryActionButton
            label={strings.settings.profileSaveAction}
            onPress={saveProfile}
            isLoading={isSaving}
            backgroundColor={colors.success}
            textColor={colors.primaryContrast}
            style={styles.saveButton}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
