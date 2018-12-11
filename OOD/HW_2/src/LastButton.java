import java.io.IOException;
import java.io.RandomAccessFile;

class LastButton extends CommandButton {
    public LastButton(BaseAddressBookPane pane, RandomAccessFile r) {
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
