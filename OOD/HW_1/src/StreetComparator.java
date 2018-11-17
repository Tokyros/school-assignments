
class StreetComparator extends RecordComparator {
    @Override
    protected int getBeginIndex() {
        return CommandButton.NAME_SIZE;
    }

    @Override
    protected int getEndIndex() {
        return getBeginIndex() + CommandButton.STREET_SIZE;
    }

    @Override
    public int compare(String o1, String o2) {

            int comparison = super.compare(o1, o2);

            if (comparison == 0) {
                return o1.compareTo(o2);
            } else {
                return comparison;
            }
    }
}
