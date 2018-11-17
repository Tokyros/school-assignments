import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.LinkedHashMap;
import java.util.TreeSet;

class IterButton extends CommandButton {
    private boolean wasClicked = false;
    public IterButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Iter");
    }

    private void removeDuplicates(){
        try {
            raf.seek(0);
            AddressIterator lit = new AddressIterator(raf);
            LinkedHashMap<String, String> map = new LinkedHashMap<>();
            while (lit.hasNext()) {
                String record = lit.next();
                String key = record.substring(0, (CommandButton.NAME_SIZE + CommandButton.CITY_SIZE + CommandButton.STATE_SIZE + CommandButton.STREET_SIZE));
                map.put(key, record);
            }

            raf.seek(0);

            for (String key : map.keySet()) {
                lit.next();
                lit.set(map.get(key));
            }

            while (lit.hasNext()) {
                lit.next();
                lit.remove();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void sortRecords(){
        try {
            raf.seek(0);
            AddressIterator addressIterator = new AddressIterator(raf);
            TreeSet<String> treeSet = new TreeSet<>(new StreetComparator());

            while (addressIterator.hasNext()) {
                treeSet.add(addressIterator.next());
            }

            System.out.println(treeSet.size());

            raf.seek(0);

            for (String record : treeSet) {
                addressIterator.next();
                addressIterator.set(record);
            }

        } catch (IOException e) {
            e.printStackTrace();
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
