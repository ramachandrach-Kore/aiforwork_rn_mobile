import {
  DocumentIcon,
  FolderIcon,
  GmailIcon,
  GoogleDriveIcon,
  ImageIcon,
  JiraIcon,
  OneDriveIcon,
  OutlookIcon,
  PDFIcon,
  PptIcon,
  SheetIcon,
  SlackIcon,
  TeamsIcon,
  ZendeskIcon,
} from "../icons/sources/index";
export const renderSourceIcons = (source: String, iconRender: Boolean) => {
  switch (source?.toLowerCase()) {
    case "gmail":
    case "mail":
      return iconRender ? GmailIcon : "Gmail";

    case "outlook":
      return iconRender ? OutlookIcon : "Outlook";
    case "gdrive":
    case "drive":
      return iconRender ? GoogleDriveIcon : "GoogleDrive";

    case "onedrive":
      return iconRender ? OneDriveIcon : "MS_onedrive";
    case "jira":
      return iconRender ? JiraIcon : "jira";
    case "hubspot":
      return iconRender ? FolderIcon : "Folder";
    case "slack":
      return iconRender ? SlackIcon : "Slack";
    case "msteams":
      return iconRender ? TeamsIcon : "Teams";
    case "knowledge":
    case "accountKnowledge":
    case "accountknowledge":
      return iconRender ? FolderIcon : "Folder";

    case "pdf":
      return iconRender ? PDFIcon : "PDF";
    case "doc":
    case "docx":
    case "txt":
    case "rtf":
      return iconRender ? DocumentIcon : "Document";

    case "xlx":
    case "xls":
    case "xlsx":
    case "csv":
      return iconRender ? SheetIcon : "Sheet";
    case "jpg":
    case "jpeg":
    case "png":
      return iconRender ? ImageIcon : "Image";
    case "zendesk":
      return iconRender ? ZendeskIcon : "Zendesk";
    case "ppt":
    case "pptx":
      return iconRender ? PptIcon : "PPT";

    default:
      return undefined;
  }
};
