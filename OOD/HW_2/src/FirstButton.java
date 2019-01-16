import java.io.IOException;
import java.io.RandomAccessFile;

class FirstButton extends CommandButton {

    public FirstButton() {
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
