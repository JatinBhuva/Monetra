# Dynamic Insights Plan

## Goal

Generate insights automatically from user data instead of showing static cards.

The first version should be:

- rule-based
- deterministic
- offline friendly
- easy to tune

This is better than adding AI first, because the app can explain insights directly from known transaction data and keep behavior predictable.

## Recommended Inputs

Use these data sources to build insights:

- all transactions
- current month totals
- previous month totals
- current year totals
- category breakdown
- expense vs income totals
- transaction frequency patterns

Later, investment data can plug into the same engine once that module exists.

## Recommended Output Shape

```ts
type Insight = {
  id: string;
  type: 'warning' | 'positive' | 'pattern' | 'summary';
  title: string;
  message: string;
  priority: number;
};
```

The UI can sort by `priority` and show the top 1 to 3 insights.

## Strong First Insight Types

Start with these:

1. Spend spike
   Example: Dining is up 32% vs last month.

2. Top category
   Example: Shopping is your biggest expense this month.

3. Biggest single expense
   Example: This is your highest single expense in 90 days.

4. Expense vs income ratio
   Example: Expenses are 64% of income this month.

5. Frequency pattern
   Example: You spent on food 18 times this month.

## Good Next Insights

After the first version, add:

- unusual transaction detection
- weekend vs weekday spend pattern
- recurring bill detection
- low-spend positive notes
- category comeback after inactive months
- month-to-date spend pacing

## Example Dynamic Insight Types

- spend spike: Dining is up 32% vs last month
- top category: Shopping is your biggest expense this month
- unusual transaction: Highest single expense in the last 90 days
- frequency pattern: Food spending happened 18 times this month
- pace warning: You have already spent 78% of your usual monthly total
- positive reduction: Transport spend is down 21% from last month
- weekday pattern: Most spending happens on weekends
- recurring pattern: A similar bill amount appeared for 3 months

## Recommended Architecture

Create a dedicated insights module, for example:

```txt
src/services/insightsEngine.ts
```

That module should:

1. accept transaction and summary data
2. apply rule-based checks
3. generate insight objects
4. rank them by priority
5. return only the most useful items

## Suggested First Implementation Order

1. build `insightsEngine.ts`
2. compute top 5 rule-based insights
3. show top 1 to 3 on Dashboard
4. reuse them on Analytics
5. tune titles, thresholds, and priority rules

## Recommendation

Do not use LLM-generated insights for the first version.

Start with rule-based insights first:

- faster
- cheaper
- easier to test
- easier to trust
- works fully offline

Once the rule engine is solid, a smarter explanation layer can be added later if needed.
