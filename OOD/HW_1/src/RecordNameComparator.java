

class RecordNameComparator extends RecordComparator {

    @Override
    protected int getBeginIndex() {
        return 0;
    }

    @Override
    protected int getEndIndex() {
        return CommandButton.NAME_SIZE;
    }
}
