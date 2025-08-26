import { AllTemplates } from "../sdk_templates/AllTemplatesConst";
import ResolveAmbiguityModal from "../sdk_templates/ResolveAmbiguityModal";

// Template Navigation Handler - Handles navigation logic for different template types
export class TemplateNavigationHandler {
  private navigation: any;
  private isResolveAmbiguityModalVisible: boolean = false;
  private resolveAmbiguityData: any = null;

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

      case AllTemplates.RESOLVE_AMBIGUITY:
        this.openResolveAmbiguityModal(message);
        break;

      default:
        console.log("Unknown template type:", templateType);
        break;
    }
  }

  // Open Resolve Ambiguity Modal
  private openResolveAmbiguityModal(message: any): void {
    this.resolveAmbiguityData = message;
    this.isResolveAmbiguityModalVisible = true;
    // Trigger re-render or modal display logic here
    // This might need to be handled by the parent component that uses this handler
  }

  // Close Resolve Ambiguity Modal
  public closeResolveAmbiguityModal(): void {
    this.isResolveAmbiguityModalVisible = false;
    this.resolveAmbiguityData = null;
  }

  // Get modal visibility state
  public getResolveAmbiguityModalVisible(): boolean {
    return this.isResolveAmbiguityModalVisible;
  }

  // Get modal data
  public getResolveAmbiguityData(): any {
    return this.resolveAmbiguityData;
  }

  // Handle modal confirmation
  public handleResolveAmbiguityConfirm(payload: any): void {
    console.log("Resolve ambiguity confirmed:", payload);
    this.closeResolveAmbiguityModal();
    // TODO: Implement ambiguity resolution logic
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
