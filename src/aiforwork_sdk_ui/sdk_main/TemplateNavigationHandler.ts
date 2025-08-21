// Template Navigation Handler - Handles navigation logic for different template types
export class TemplateNavigationHandler {
  private navigation: any;

  constructor(navigation: any) {
    this.navigation = navigation;
  }

  // Route names constants
  private static readonly ROUTE_NAMES = {
    CREATE_JIRA_TABLE: "CREATE_JIRA_TABLE",
    FORM_BUILDER: "FORM_BUILDER",
    DATA_LIST: "DATA_LIST",
    SETTINGS_PANEL: "SETTINGS_PANEL",
    WORKFLOW: "WORKFLOW",
  } as const;

  // Handle navigation based on template type
  public handleTemplateNavigation(message: any): void {
    const { templateType } = message;

    switch (templateType) {
      case "jira_table":
        this.navigateToJiraTable();
        break;

      case "form_builder":
        this.navigateToFormBuilder();
        break;

      default:
        console.log("Unknown template type:", templateType);
        break;
    }
  }

  // Navigation methods for each template type
  private navigateToJiraTable(): void {
    this.navigation.navigate(
      TemplateNavigationHandler.ROUTE_NAMES.CREATE_JIRA_TABLE,
      {
        onConfirmCallback: this.createSingleJira.bind(this),
      }
    );
  }

  private navigateToFormBuilder(): void {
    this.navigation.navigate(
      TemplateNavigationHandler.ROUTE_NAMES.FORM_BUILDER,
      {
        onFormSubmit: this.handleFormSubmit.bind(this),
        onFormCancel: this.handleFormCancel.bind(this),
      }
    );
  }

  // Callback functions for different template types
  private createSingleJira(data: any): void {
    console.log("Creating single JIRA:", data);
    // TODO: Implement JIRA creation logic
  }

  private handleFormSubmit(formData: any): void {
    console.log("Form submitted:", formData);
    // TODO: Implement form submission logic
  }

  private handleFormCancel(): void {
    console.log("Form cancelled");
    // TODO: Implement form cancellation logic
  }
}
