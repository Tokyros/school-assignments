import java.io.RandomAccessFile;

public class UndoButton extends CommandButton {

    public UndoButton() {
        this.setText("Undo");
    }

    @Override
    public void Execute() {
        System.out.println("UNDOINGGG");
    }
}
