import javafx.scene.control.Button;

import java.io.IOException;
import java.io.RandomAccessFile;

class CommandButton extends Button implements Command {
    public final static int NAME_SIZE = 32;
    public final static int STREET_SIZE = 32;
    public final static int CITY_SIZE = 20;
    public final static int STATE_SIZE = 2;
    public final static int ZIP_SIZE = 5;
    public final static int RECORD_SIZE =
            (NAME_SIZE + STREET_SIZE + CITY_SIZE + STATE_SIZE + ZIP_SIZE);
    protected BaseAddressBookPane p;
    protected RandomAccessFile raf;

    public void setPane(BaseAddressBookPane p) {
        this.p = p;
    }

    public void setFile(RandomAccessFile file) {
        this.raf = file;
    }

//    public CommandButton(BaseAddressBookPane pane, RandomAccessFile r) {
//        super();
//        p = pane;
//        raf = r;
//    }

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
