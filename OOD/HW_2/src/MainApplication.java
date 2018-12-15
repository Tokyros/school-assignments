
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;
import javafx.stage.Stage;

public class MainApplication extends Application {
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        AddressBookPaneIFC pane = new AddressBookPaneEditButtonsDecorator(BaseAddressBookPane.getInstance());
        GridPane.setHgrow(pane, Priority.ALWAYS);
        GridPane.setVgrow(pane, Priority.ALWAYS);
        Scene scene = new Scene(pane);
        scene.getStylesheets().add("styles.css");
        primaryStage.setTitle("AddressBook");
        primaryStage.setScene(scene);
        primaryStage.show();
        primaryStage.setAlwaysOnTop(true);

        for (int i = 0; i < 3; i++) {
            AddressBookPaneIFC secondaryPane = BaseAddressBookPane.getInstance();
            if (secondaryPane == null) {
                System.out.println("Singelton violation. Only 3 panes were created");
            } else {
                Stage secondaryStage = new Stage();
                Scene secondaryScene = new Scene(secondaryPane);
                secondaryStage.setScene(secondaryScene);
                secondaryStage.show();
            }

        }
    }
}

