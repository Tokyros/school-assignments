public class AddressBookOriginator {
    private String state;

    public void setState(String state) {
        this.state = state;
    }

    public AddressBookMemento save() {
        return new AddressBookMemento(state);
    }

    public void restore(AddressBookMemento memento) {
        state = memento.getState();
    }
}
