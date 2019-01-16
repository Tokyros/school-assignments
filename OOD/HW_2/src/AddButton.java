
class AddButton extends CommandButton {

    public AddButton() {
        this.setText("Add");
    }

    @Override
    public void Execute() {
        writeAddress();

        originator.setState(getEntireFile());
        caretaker.add(originator.save());
    }
}
