import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;
import javafx.stage.Stage;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.*;

public class AddressBookJavaFx extends Application {
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        AddressBookPane pane = new AddressBookPane();
        Scene scene = new Scene(pane);
        scene.getStylesheets().add("styles.css");
        primaryStage.setTitle("AddressBook");
        primaryStage.setScene(scene);
        primaryStage.show();
        primaryStage.setAlwaysOnTop(true);
    }
}

class AddressBookPane extends GridPane {
    private RandomAccessFile raf;
    // Text fields
    private TextField jtfName = new TextField();
    private TextField jtfStreet = new TextField();
    private TextField jtfCity = new TextField();
    private TextField jtfState = new TextField();
    private TextField jtfZip = new TextField();
    // Buttons
    private AddButton jbtAdd;
    private FirstButton jbtFirst;
    private NextButton jbtNext;
    private PreviousButton jbtPrevious;
    private LastButton jbtLast;
    private Sort1Button jbtSort1;
    private Sort2Button jbtSort2;
    private IterButton jbtIter;
    public EventHandler<ActionEvent> ae =
            new EventHandler<ActionEvent>() {
                public void handle(ActionEvent arg0) {
                    ((Command) arg0.getSource()).Execute();
                }
            };

    public AddressBookPane() { // Open or create a random access file
        try {
            raf = new RandomAccessFile("address.dat", "rw");
        } catch (IOException ex) {
            System.out.print("Error: " + ex);
            System.exit(0);
        }
        jtfState.setAlignment(Pos.CENTER_LEFT);
        jtfState.setPrefWidth(25);
        jtfZip.setPrefWidth(60);
        jbtAdd = new AddButton(this, raf);
        jbtFirst = new FirstButton(this, raf);
        jbtNext = new NextButton(this, raf);
        jbtPrevious = new PreviousButton(this, raf);
        jbtLast = new LastButton(this, raf);
        jbtSort1 = new Sort1Button(this, raf);
        jbtSort2 = new Sort2Button(this, raf);
        jbtIter = new IterButton(this, raf);
        Label state = new Label("State");
        Label zp = new Label("Zip");
        Label name = new Label("Name");
        Label street = new Label("Street");
        Label city = new Label("City");
        // Panel p1 for holding labels Name, Street, and City
        GridPane p1 = new GridPane();
        p1.add(name, 0, 0);
        p1.add(street, 0, 1);
        p1.add(city, 0, 2);
        p1.setAlignment(Pos.CENTER_LEFT);
        p1.setVgap(8);
        p1.setPadding(new Insets(0, 2, 0, 2));
        GridPane.setVgrow(name, Priority.ALWAYS);
        GridPane.setVgrow(street, Priority.ALWAYS);
        GridPane.setVgrow(city, Priority.ALWAYS);
        // City Row
        GridPane adP = new GridPane();
        adP.add(jtfCity, 0, 0);
        adP.add(state, 1, 0);
        adP.add(jtfState, 2, 0);
        adP.add(zp, 3, 0);
        adP.add(jtfZip, 4, 0);
        adP.setAlignment(Pos.CENTER_LEFT);
        GridPane.setHgrow(jtfCity, Priority.ALWAYS);
        GridPane.setVgrow(jtfCity, Priority.ALWAYS);
        GridPane.setVgrow(jtfState, Priority.ALWAYS);
        GridPane.setVgrow(jtfZip, Priority.ALWAYS);
        GridPane.setVgrow(state, Priority.ALWAYS);
        GridPane.setVgrow(zp, Priority.ALWAYS);
        // Panel p4 for holding jtfName, jtfStreet, and p3
        GridPane p4 = new GridPane();
        p4.add(jtfName, 0, 0);
        p4.add(jtfStreet, 0, 1);
        p4.add(adP, 0, 2);
        p4.setVgap(1);
        GridPane.setHgrow(jtfName, Priority.ALWAYS);
        GridPane.setHgrow(jtfStreet, Priority.ALWAYS);
        GridPane.setHgrow(adP, Priority.ALWAYS);
        GridPane.setVgrow(jtfName, Priority.ALWAYS);
        GridPane.setVgrow(jtfStreet, Priority.ALWAYS);
        GridPane.setVgrow(adP, Priority.ALWAYS);
        // Place p1 and p4 into jpAddress
        GridPane jpAddress = new GridPane();
        jpAddress.add(p1, 0, 0);
        jpAddress.add(p4, 1, 0);
        GridPane.setHgrow(p1, Priority.NEVER);
        GridPane.setHgrow(p4, Priority.ALWAYS);
        GridPane.setVgrow(p1, Priority.ALWAYS);
        GridPane.setVgrow(p4, Priority.ALWAYS);
        // Set the panel with line border
        jpAddress.setStyle("-fx-border-color: grey;"
                + " -fx-border-width: 1;"
                + " -fx-border-style: solid outside ;");
        // Add buttons to a panel
        FlowPane jpButton = new FlowPane();
        jpButton.setHgap(5);
        jpButton.getChildren().addAll(jbtAdd, jbtFirst,
                jbtNext, jbtPrevious, jbtLast, jbtSort1, jbtSort2, jbtIter);
        jpButton.setAlignment(Pos.CENTER);
        GridPane.setVgrow(jpButton, Priority.NEVER);
        GridPane.setVgrow(jpAddress, Priority.ALWAYS);
        GridPane.setHgrow(jpButton, Priority.ALWAYS);
        GridPane.setHgrow(jpAddress, Priority.ALWAYS);
        // Add jpAddress and jpButton to the stage
        this.setVgap(5);
        this.add(jpAddress, 0, 0);
        this.add(jpButton, 0, 1);
        jbtAdd.setOnAction(ae);
        jbtFirst.setOnAction(ae);
        jbtNext.setOnAction(ae);
        jbtPrevious.setOnAction(ae);
        jbtLast.setOnAction(ae);
        jbtSort1.setOnAction(ae);
        jbtSort2.setOnAction(ae);
        jbtIter.setOnAction(ae);
        jbtFirst.Execute();
    }

    public void actionHandled(ActionEvent e) {
        ((Command) e.getSource()).Execute();
    }

    public void SetName(String text) {
        jtfName.setText(text);
    }

    public void SetStreet(String text) {
        jtfStreet.setText(text);
    }

    public void SetCity(String text) {
        jtfCity.setText(text);
    }

    public void SetState(String text) {
        jtfState.setText(text);
    }

    public void SetZip(String text) {
        jtfZip.setText(text);
    }

    public String GetName() {
        return jtfName.getText();
    }

    public String GetStreet() {
        return jtfStreet.getText();
    }

    public String GetCity() {
        return jtfCity.getText();
    }

    public String GetState() {
        return jtfState.getText();
    }

    public String GetZip() {
        return jtfZip.getText();
    }
}

interface Command {
    public void Execute();
}

class CommandButton extends Button implements Command {
    public final static int NAME_SIZE = 32;
    public final static int STREET_SIZE = 32;
    public final static int CITY_SIZE = 20;
    public final static int STATE_SIZE = 10;
    public final static int ZIP_SIZE = 5;
    public final static int RECORD_SIZE =
            (NAME_SIZE + STREET_SIZE + CITY_SIZE + STATE_SIZE + ZIP_SIZE);
    protected AddressBookPane p;
    protected RandomAccessFile raf;

    public CommandButton(AddressBookPane pane, RandomAccessFile r) {
        super();
        p = pane;
        raf = r;
    }

    public void Execute() {
    }

    /**
     * Write a record at the end of the file
     */
    public void writeAddress() {
        try {
            raf.seek(raf.length());
            FixedLengthStringIO.writeFixedLengthString(p.GetName(),
                    NAME_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(p.GetStreet(),
                    STREET_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(p.GetCity(),
                    CITY_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(p.GetState(),
                    STATE_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(p.GetZip(),
                    ZIP_SIZE, raf);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Read a record at the specified position
     */
    public void readAddress(long position) throws IOException {
        raf.seek(position);
        String name =
                FixedLengthStringIO.readFixedLengthString(NAME_SIZE, raf);
        String street =
                FixedLengthStringIO.readFixedLengthString(STREET_SIZE, raf);
        String city =
                FixedLengthStringIO.readFixedLengthString(CITY_SIZE, raf);
        String state =
                FixedLengthStringIO.readFixedLengthString(STATE_SIZE, raf);
        String zip =
                FixedLengthStringIO.readFixedLengthString(ZIP_SIZE, raf);
        p.SetName(name);
        p.SetStreet(street);
        p.SetCity(city);
        p.SetState(state);
        p.SetZip(zip);
    }
}

class AddButton extends CommandButton {
    public AddButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Add");
    }

    @Override
    public void Execute() {
        writeAddress();
    }
}

class NextButton extends CommandButton {
    public NextButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Next");
    }

    @Override
    public void Execute() {
        try {
            long currentPosition = raf.getFilePointer();
            if (currentPosition < raf.length())
                readAddress(currentPosition);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}

class PreviousButton extends CommandButton {
    public PreviousButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Previous");
    }

    @Override
    public void Execute() {
        try {
            long currentPosition = raf.getFilePointer();
            if (currentPosition - 2 * 2 * RECORD_SIZE >= 0)
                readAddress(currentPosition - 2 * 2 * RECORD_SIZE);
            else ;
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}

class LastButton extends CommandButton {
    public LastButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Last");
    }

    @Override
    public void Execute() {
        try {
            long lastPosition = raf.length();
            if (lastPosition > 0)
                readAddress(lastPosition - 2 * RECORD_SIZE);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}

class FirstButton extends CommandButton {
    public FirstButton(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("First");
    }

    @Override
    public void Execute() {
        try {
            if (raf.length() > 0) readAddress(0);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}

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

class Sort1Button extends SortButton {
    public Sort1Button(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Sort1");
    }

    @Override
    Comparator<Long> getComparator() {
        return new RecordNameComparator(raf, NAME_SIZE);
    }
}

class Sort2Button extends SortButton {
    public Sort2Button(AddressBookPane pane, RandomAccessFile r) {
        super(pane, r);
        this.setText("Sort2");
    }

    @Override
    Comparator<Long> getComparator() {
        int zipCodeOffset = 2 * (NAME_SIZE + CITY_SIZE + STREET_SIZE + STATE_SIZE);
        return new ZipCodeComparator(raf, ZIP_SIZE, zipCodeOffset);
    }
}

class RecordNameComparator implements Comparator<Long> {
    private RandomAccessFile raf;
    private int nameSize;

    public RecordNameComparator(RandomAccessFile raf, int nameSize) {
        this.raf = raf;
        this.nameSize = nameSize;
    }
    @Override
    public int compare(Long o1, Long o2) {
        try {
            this.raf.seek(o1);
            String name1 = FixedLengthStringIO.readFixedLengthString(nameSize, raf);
            this.raf.seek(o2);
            String name2 = FixedLengthStringIO.readFixedLengthString(nameSize, raf);
            return name1.compareTo(name2);
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }
}

class ZipCodeComparator implements Comparator<Long> {
    private RandomAccessFile raf;
    private int zipCodeSize;
    private int zipCodeOffset;

    public ZipCodeComparator(RandomAccessFile raf, int zipCodeSize, int zipCodeOffset) {
        this.raf = raf;
        this.zipCodeSize = zipCodeSize;
        this.zipCodeOffset = zipCodeOffset;
    }

    @Override
    public int compare(Long o1, Long o2) {
        try {
            raf.seek(o1 + zipCodeOffset);
            String zipCode1 = FixedLengthStringIO.readFixedLengthString(zipCodeSize, raf);
            Integer zipCodeNum1 = Integer.parseInt(zipCode1.trim());
            raf.seek(o2 + zipCodeOffset);
            String zipCode2 = FixedLengthStringIO.readFixedLengthString(zipCodeSize, raf);
            Integer zipCodeNum2 = Integer.parseInt(zipCode2.trim());
            return zipCodeNum1.compareTo(zipCodeNum2);
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }
}

class StreetComparator implements Comparator<String> {
    @Override
    public int compare(String o1, String o2) {
            int streetAddressOffset = CommandButton.NAME_SIZE;
            int streetAddressSize = CommandButton.STREET_SIZE;

            String streetAddress1 = o1.substring(streetAddressOffset, streetAddressOffset + streetAddressSize);
            String streetAddress2 = o2.substring(streetAddressOffset, streetAddressOffset + streetAddressSize);

            int comparison = streetAddress1.compareTo(streetAddress2);

            if (comparison == 0) {
                return o1.compareTo(o2);
            } else {
                return comparison;
            }
    }
}

class AddressIterator implements ListIterator<String> {
    private RandomAccessFile raf;
    private boolean canSetAddOrRemove = false;

    public AddressIterator(RandomAccessFile raf) {
        this.raf = raf;
    }

    private int size () {
        try {
            return positionToIndex(raf.length());
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }

    private int positionToIndex(long position) {
        return (int) position / (CommandButton.RECORD_SIZE * 2);
    }

    private long indexToPosition(int index) {
        return index * CommandButton.RECORD_SIZE * 2;
    }

    @Override
    public boolean hasNext() {
        return nextIndex() < size();
    }

    @Override
    public String next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        try {
            String next = FixedLengthStringIO.readFixedLengthString(CommandButton.RECORD_SIZE, raf);
            canSetAddOrRemove = true;
            return next;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public boolean hasPrevious() {
        return previousIndex() >= 0;
    }

    @Override
    public String previous() {
        if (!hasPrevious()) {
            throw new NoSuchElementException();
        }
        try {
            raf.seek(indexToPosition(previousIndex()));
            String previous = FixedLengthStringIO.readFixedLengthString(CommandButton.RECORD_SIZE, raf);
            canSetAddOrRemove = true;
            return previous;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public int nextIndex() {
        try {
            return positionToIndex(raf.getFilePointer());
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public int previousIndex() {
        int nextIndex = nextIndex();
        return nextIndex - 2 >= 0 ? nextIndex - 2 : -1;
    }

    @Override
    public void remove() {
        if (!canSetAddOrRemove) {
            throw new IllegalStateException();
        }
        try {
            int indexToRemove = previousIndex() + 1;
            long positionToRemove = indexToPosition(indexToRemove);
            int restOfFileSize = (int) indexToPosition(size() - 1 - indexToRemove);
            String restOfFile = FixedLengthStringIO.readFixedLengthString(restOfFileSize/2, raf);
            raf.seek(positionToRemove);
            FixedLengthStringIO.writeFixedLengthString(restOfFile, restOfFileSize/2, raf);
            raf.setLength(raf.length() - (CommandButton.RECORD_SIZE * 2));
            raf.seek(positionToRemove);
            canSetAddOrRemove = false;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void set(String s) {
        if (!canSetAddOrRemove) {
            throw new IllegalStateException();
        }
        try {
            int indexToSet = previousIndex() + 1;
            long positionToSet = indexToPosition(indexToSet);
            raf.seek(positionToSet);
            FixedLengthStringIO.writeFixedLengthString(s, CommandButton.RECORD_SIZE, raf);
            canSetAddOrRemove = false;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void add(String s) {
        if (!canSetAddOrRemove) {
            throw new IllegalStateException();
        }
        try {
            int indexToAdd = previousIndex() + 1;
            long positionToAdd = indexToPosition(indexToAdd);
            int restOfFileSize = (int) indexToPosition(size() - 1 - indexToAdd);
            raf.seek(positionToAdd);
            String restOfFile = FixedLengthStringIO.readFixedLengthString(restOfFileSize/2, raf);
            raf.seek(positionToAdd);
            FixedLengthStringIO.writeFixedLengthString(s, CommandButton.RECORD_SIZE, raf);
            FixedLengthStringIO.writeFixedLengthString(restOfFile, restOfFileSize/2, raf);
            raf.seek(positionToAdd + CommandButton.RECORD_SIZE * 2);
            canSetAddOrRemove = false;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

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