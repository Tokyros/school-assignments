import javafx.application.Application;
import javafx.stage.Stage;
import javafx.scene.Scene;

import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.application.Platform;

public class ClockStartStopJavaFx extends Application {
    @Override // Override the start method in the Application class
    public void start(Stage primaryStage) {
        ClockPane clock = new ClockPane(); // Create a clock
        HBox hBox = new HBox(5);
        Button btStop = new Button("Stop");
        Button btStart = new Button("Start");
        hBox.getChildren().addAll(btStop, btStart);
        hBox.setAlignment(Pos.CENTER);
        BorderPane pane = new BorderPane();
        pane.setCenter(clock);
        pane.setBottom(hBox);
        // Create a scene and place it in the stage
        Scene scene = new Scene(pane, 250, 300);
        primaryStage.setTitle("ClockStartStop"); // Set the stage title
        primaryStage.setScene(scene); // Place the scene in the stage
        primaryStage.show(); // Display the stage
        primaryStage.setAlwaysOnTop(true);
        primaryStage.setOnCloseRequest
                (event -> {
                    Platform.exit();
                    System.exit(0);
                });
        btStart.setOnAction(e -> clock.play());
        btStop.setOnAction(e -> clock.pause());
        clock.widthProperty().addListener(ov ->
        {
            clock.setW(pane.getWidth());
        });
        clock.heightProperty().addListener(ov ->
        {
            clock.setH(pane.getHeight());
        });
    }

    public static void main(String[] args) {
        launch(args);
    }
}
