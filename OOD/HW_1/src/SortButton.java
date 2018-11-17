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

    abstract RecordComparator getComparator();

    private void sort(){
        try {
            long n = getRecordsCount();
            for (int i = 0; i < n-1; i++){
                for (int j = 0; j < n-i-1; j++){
                    long record1pos = j * RECORD_SIZE * 2;
                    long record2pos = (j+1) * RECORD_SIZE * 2;

                    raf.seek(record1pos);
                    String address1 = FixedLengthStringIO.readFixedLengthString(RECORD_SIZE, raf);
                    String address2 = FixedLengthStringIO.readFixedLengthString(RECORD_SIZE, raf);

                    if (getComparator().compare(address1, address2) > 0)
                        swapRecords(record1pos, record2pos, address1, address2);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private long getRecordsCount() throws IOException {
        return this.raf.length() / (RECORD_SIZE * 2);
    }


    private void swapRecords(long pos1, long pos2, String record1, String record2) throws IOException {
        raf.seek(pos2);
        raf.writeChars(record1);
        raf.seek(pos1);
        raf.writeChars(record2);
    }
}

