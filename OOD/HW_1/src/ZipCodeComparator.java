
class ZipCodeComparator extends RecordComparator {
    @Override
    public int compare(String o1, String o2) {
        String zip1 = getStringToCompare(o1);
        String zip2 = getStringToCompare(o2);

        Integer zipCodeNum1 = Integer.parseInt(zip1);
        Integer zipCodeNum2 = Integer.parseInt(zip2);
        return zipCodeNum1.compareTo(zipCodeNum2);
    }

    @Override
    protected int getBeginIndex() {
        return CommandButton.NAME_SIZE + CommandButton.STREET_SIZE + CommandButton.CITY_SIZE + CommandButton.STATE_SIZE;
    }

    @Override
    protected int getEndIndex() {
        return getBeginIndex() + CommandButton.ZIP_SIZE;
    }
}
