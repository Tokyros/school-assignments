import java.io.IOException;
import java.io.RandomAccessFile;

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
