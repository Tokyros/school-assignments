import java.io.RandomAccessFile;

public class RedoButton extends CommandButton {

    public RedoButton() {
        this.setText("Redo");
    }

    @Override
    public void Execute() {
        System.out.println("REDOING");
    }
}
