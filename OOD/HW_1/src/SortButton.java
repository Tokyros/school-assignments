import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.Comparator;

abstract class SortButton extends CommandButton {
    public SortButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
    }

    @Override
    public void Execute() {
        sort();
    }

    abstract Comparator<Long> getComparator();

    private void sort(){
        try {
            long n = getRecordsCount();
            for (int i = 0; i < n-1; i++){
                for (int j = 0; j < n-i-1; j++){
                    long record1pos = j * RECORD_SIZE * 2;
                    long record2pos = (j+1) * RECORD_SIZE * 2;
                    if (getComparator().compare(record1pos, record2pos) > 0)
                        swapRecords(record1pos, record2pos);
                }
            }
        } catch (IOException e) {
            System.err.println("An IOException occurred while trying to sort records");
            e.printStackTrace();
        }
    }

    private long getRecordsCount() throws IOException {
        return this.raf.length() / (RECORD_SIZE * 2);
    }


    private void swapRecords(long pos1, long pos2) throws IOException {
        raf.seek(pos1);
        String rec1 = FixedLengthStringIO.readFixedLengthString(RECORD_SIZE, raf);
        raf.seek(pos2);
        String rec2 = FixedLengthStringIO.readFixedLengthString(RECORD_SIZE, raf);
        raf.seek(pos2);
        raf.writeChars(rec1);
        raf.seek(pos1);
        raf.writeChars(rec2);
    }
}

