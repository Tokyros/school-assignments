import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.*;

class IterButton extends CommandButton {
    private boolean wasClicked = false;
    public IterButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Iter");
    }

    private void removeDuplicates(){
        try {
            raf.seek(0);
            ListIterator<String> lit = iterator();
            LinkedHashMap<String, String> map = new LinkedHashMap<>();
            while (lit.hasNext()) {
                String record = lit.next();
                String key = record.substring(0, (CommandButton.NAME_SIZE + CommandButton.CITY_SIZE + CommandButton.STATE_SIZE + CommandButton.STREET_SIZE));
                map.put(key, record);
            }

            raf.seek(0);
            readFromIterator(map.values().iterator());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sortRecords(){
        try {
            raf.seek(0);
            ListIterator<String> addressIterator = iterator();
            TreeSet<String> treeSet = new TreeSet<>(new StreetComparator());

            while (addressIterator.hasNext()) {
                treeSet.add(addressIterator.next());
            }

            readFromIterator(treeSet.iterator());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void readFromIterator(Iterator<String> iter) throws IOException {
        raf.seek(0);
        ListIterator<String> recordIterator = iterator();

        while (iter.hasNext()) {
            if (recordIterator.hasNext()) {
                recordIterator.next();
                recordIterator.set(iter.next());
            } else {
                recordIterator.add(iter.next());
            }
        }

        while (recordIterator.hasNext()) {
            recordIterator.next();
            recordIterator.remove();
        }
    }

    @Override
    public void Execute() {
        if (!wasClicked) {
            removeDuplicates();
            wasClicked = true;
        } else {
            sortRecords();
        }
        new FirstButton(p, raf).Execute();
    }
}
