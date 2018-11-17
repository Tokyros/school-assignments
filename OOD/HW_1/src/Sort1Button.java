import java.io.RandomAccessFile;
import java.util.Comparator;

class Sort1Button extends SortButton {
    public Sort1Button(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Sort1");
    }

    @Override
    RecordNameComparator getComparator() {
        return new RecordNameComparator();
    }
}
