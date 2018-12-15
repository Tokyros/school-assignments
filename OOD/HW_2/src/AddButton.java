import java.io.RandomAccessFile;

class AddButton extends CommandButton {
//    public AddButton(BaseAddressBookPane pane, RandomAccessFile r) {
//        super(pane, r);
//        this.setText("Add");
//    }

    public AddButton() {
        this.setText("Add");
    }

    @Override
    public void Execute() {
        writeAddress();
    }
}
