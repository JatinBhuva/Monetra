import React from 'react';
import { Modal, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { assets } from '../../../assets';
import { useAppTheme, useThemedStyles } from '../../../theme';
import { strings } from '../../../utils/strings';
import QuickActionCard from './QuickActionCard';
import { createStyles } from './styles';

type QuickActionModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddExpense: () => void;
  onAddIncome: () => void;
  onAddInvestment: () => void;
};

const QuickActionModal = ({
  visible,
  onClose,
  onAddExpense,
  onAddIncome,
  onAddInvestment,
}: QuickActionModalProps) => {
  const { isDark } = useAppTheme();
  const styles = useThemedStyles(colors => createStyles(colors, isDark));

  const ExpenseCardIcon = assets.icons.expenseCard;
  const InvestmentCardIcon = assets.icons.investmentCard;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView edges={['bottom']} style={styles.modalSafeArea}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.title}>{strings.transactions.quickActionSheetTitle}</Text>
              <Text style={styles.subtitle}>
                {strings.transactions.quickActionSheetSubtitle}
              </Text>

              <QuickActionCard
                styles={styles}
                title={strings.transactions.quickActionExpenseTitle}
                description={strings.transactions.quickActionExpenseDescription}
                actionText={strings.transactions.quickActionExpenseAction}
                onPress={onAddExpense}
                DecorIcon={ExpenseCardIcon}
                MainIcon={ExpenseCardIcon}
                decorWrapStyle={styles.entryCardDecorExpense}
                iconWrapStyle={styles.entryCardIconWrapExpense}
                decorIconStyle={styles.entryCardDecorExpenseIcon}
                mainIconStyle={styles.entryCardExpenseIcon}
                decorFill={isDark ? '#D1D7E2' : '#B9C2D0'}
                mainFill={isDark ? '#EAF1FF' : '#2D5E9A'}
              />

              <QuickActionCard
                styles={styles}
                title={strings.transactions.quickActionInvestmentTitle}
                description={strings.transactions.quickActionInvestmentDescription}
                actionText={strings.transactions.quickActionInvestmentAction}
                onPress={onAddInvestment}
                DecorIcon={InvestmentCardIcon}
                MainIcon={InvestmentCardIcon}
                decorWrapStyle={styles.entryCardDecorInvestment}
                iconWrapStyle={styles.entryCardIconWrapInvestment}
                actionStyle={styles.entryCardActionInvestment}
                decorIconStyle={styles.entryCardDecorInvestmentIcon}
                mainIconStyle={styles.entryCardInvestmentIcon}
                decorFill={isDark ? '#D1D7E2' : '#B9C2D0'}
                mainFill={isDark ? '#5AF0B2' : '#129764'}
              />

              <QuickActionCard
                styles={styles}
                title={strings.transactions.quickActionIncomeTitle}
                description={strings.transactions.quickActionIncomeDescription}
                actionText={strings.transactions.quickActionIncomeAction}
                onPress={onAddIncome}
                DecorIcon={InvestmentCardIcon}
                MainIcon={InvestmentCardIcon}
                decorWrapStyle={styles.entryCardDecorIncome}
                iconWrapStyle={styles.entryCardIconWrapIncome}
                actionStyle={styles.entryCardActionIncome}
                decorIconStyle={styles.entryCardDecorInvestmentIcon}
                mainIconStyle={styles.entryCardIncomeIcon}
                decorFill={isDark ? '#D1D7E2' : '#B9C2D0'}
                mainFill={isDark ? '#DDE8FF' : '#2D5E9A'}
              />

              <Pressable style={styles.dismiss} onPress={onClose}>
                <Text style={styles.dismissText}>
                  {strings.transactions.quickActionDismiss}
                </Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default QuickActionModal;
