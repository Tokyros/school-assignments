import java.util.Stack;

public class AddressBookCaretaker {
    private Stack<AddressBookMemento> addStack = new Stack<>();
    private Stack<AddressBookMemento> undoStack = new Stack<>();

    public void add(AddressBookMemento memento) {
        undoStack.clear();
        addStack.push(memento);
    }

    public String undo() {
        if (addStack.empty()) {
            return null;
        }
        undoStack.push(addStack.pop());
        if (addStack.empty()) {
            return null;
        }
        return addStack.peek().getState();
    }

    public String redo() {
        if (undoStack.empty()) {
            return null;
        }
        addStack.push(undoStack.pop());
        return addStack.peek().getState();
    }
}
