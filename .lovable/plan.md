

# Fix: Restore Dotted Separator Between Slot Groups

## What Changed

The dotted separator line between combo slot groups was accidentally removed. It needs to be restored so each slot (e.g., "Drink" with Mango Bite + Pepsi) is visually separated from the next slot (e.g., "Side" with Curd).

## Visual Structure

```text
Combo (Choose 1)
[Mango Bite - default]  [Pepsi - +3.50 SAR]
- - - - - - - - - - - - - - - - - - - - - -   <-- dotted line here
Combo (Choose 1)
[Curd - default]
```

## Change (1 file)

**`src/components/pos/modals/ReplacementPills.tsx`** (line 34)

Restore the dotted border-bottom on the wrapper div for all groups except the last:

```
// Current (no separator):
<div className={cn(!isLast && "pb-4 mb-4")}>

// Fixed (dotted separator between groups):
<div className={cn(!isLast && "border-b border-dotted border-gray-300 pb-4 mb-4")}>
```

This is a single-line revert that adds back the `border-b border-dotted border-gray-300` classes. No other files or logic changes needed.
