<img align="right" width="250" height="47" src="./media/Gematik_Logo_Flag.png"/> <br/>    

# Release portal-disease

## Release 1.5.0
- fix form and pdf issues with §6.1 follow-up notifications
- Disease-Notification now entails versions of code systems
- Use notifiedPersonNotByName config from Portal-Core
- Update @gematik/demis-portal-core-library to 2.3.3
- Fix pdf naming issue for 7.3 notification

## Release 1.4.3
- Added FEATURE_FLAG_DISEASE_STRICT for strict §6.1 coming with FHIR profile 7.x
- Removed FEATURE_FLAG_PORTAL_SUBMIT and FEATURE_FLAG_PORTAL_ERROR_DIALOG_ON_SUBMIT
- Switch to SectionHeader from Portal-Core (FEATURE_FLAG_PORTAL_PAGE_STRUCTURE)
- add code field to quantities
- Update ngx-formly to 7.0.0
- Update @gematik/demis-portal-core-library to 2.3.2
- Fixed a bug were the information about the pregnancy week was not sent to the backend
- Update NGINX-Base-Image to 1.29.3
- Implement §6.1 follow-up notification (FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE)

## Release 1.4.2
- Removed FEATURE_FLAG_PORTAL_REPEAT
- Add quantity validation for number type input fields
- add configmap checksum as annotation to force pod restart on configmap change
- Updated openapi-generator-cli to 2.23.3
- Update @angular-devkit/build-angular to 19.2.17
- Fix change detection issue for 7.3 notification 
- Update @gematik/demis-portal-core-library to 2.2.3

## Release 1.4.1
- Fix background block for submit dialog
- Upgraded dependencies
- Added test:coverage npm script to run a single test run with coverage report
- Enable quantities for nested questionnaires
- Used generic datepicker for all date fields (FEATURE_FLAG_DISEASE_DATEPICKER)
- Remove feature flag FEATURE_FLAG_HOSP_COPY_CHECKBOXES
- Use submit- and spinner-dialog from Portal-Core (FEATURE_FLAG_PORTAL_SUBMIT)

## Release 1.4.0
- Switch to errorDialog from CoreLibrary for submit (FEATURE_FLAG_PORTAL_ERROR_DIALOG_ON_SUBMIT)
- add new API endpoints activated by feature flag FEATURE_FLAG_NEW_API_ENDPOINTS
- add fhir-profile header for futs requests

## Release 1.3.7
- Upgraded to Angular 19

## Release 1.3.6
- Added hotfix for submit dialog

## Release 1.3.5
- Implementation of §7.3 notification (non nominal)

## Release 1.3.4
- Updated Readme license disclaimer
- Move paste box to core lib
- Update design of input fields

## Release 1.3.3
- changed inputs to outline style

## Release 1.3.2
- Updated ospo-resources for adding additional notes and disclaimer

## Release 1.3.1
- Add new font and background color

## Release 1.3.0
- First official GitHub-Release
