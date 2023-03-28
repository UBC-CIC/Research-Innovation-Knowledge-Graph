# User Guide

**Before Continuing with this User Guide, please make sure you have deployed the frontend and backend stacks.**

- [Deployment Guides](./DeploymentGuide.md)

| Index                                                      | Description                                           |
| :--------------------------------------------------------- | :---------------------------------------------------- |
| [Home](#Home)                                              | Home Page                                             |
| [Main Graph](#Main-Graph)                                  | Main graph (Displays all Researchers)                 |
| [Researchers Search](#Researcher-Search)                   | Researcher search bar (By name)                       |
| [Researcher Node Selection](#Researcher-Node-Selection)    | Researcher profile and information page               |
| [Side Panel](#Side-Panel)                                  | Additional information about the graph                |
| [Filters](#Filters)                                        | Filters for the graph                                 |
| [Updating Researchers](#Updating-Researchers)              | Process for Updating Researcher Data                  |

**Note:** The screenshots contained in this User Guide show some information as redacted to obscure data that is not fully up to date.
<br>

## Home

The Home page displays the main view of the website and all components. This includes the [Main Graph Component](#main-graph), [Searchbar Component](#researcher-search), [Filters](#Filters), and the [Side Panel](#Side-Panel).

![alt text](images/userGuide/home01.png)
![alt text](images/userGuide/home02.png)

#### NOTE: "Innovation Connections" logo in this document may be replaced with the logo of the institution that will deploy this solution. 

## Main Graph

The main graph displays all the researchers in the graph, where each researcher is represented as a node and an edge is the connection between two researchers. A connection between two researchers means that they have co-authored a research paper together. 

The color of each node represents which faculty they are in. Opening the [Graph Legend](#Graph-Legend) on the [Side Panel](#Side-Panel) will display which color represents which faculty. The thickness of the edge represents how well connected two researchers are, and this metric is determined by the number of papers the researchers share. 

At the bottom right of the main graph are 3 view options. The `+` and `-` allows the user to zoom in and out of the graph respectively. These can also be controlled by using the scroll wheel to zoom in and out. The last option returns the graph to the default zoom level and centers the graph. 

## Researcher Search

The search bar allows the user to search for a specific researcher by their name. As you type into the search bar, a dropdown list of suggested researchers that match the current string appears. Clicking on a node zooms into the selected researcher ([Researcher Node Selection Mode](#Researcher-Node-Selection)).

![alt text](images/userGuide/researchers01.png)

## Researcher Node Selection

When a node is clicked on the graph it zooms into the selected researcher and defaults to showing their direct connections (higher level depth connections can be controlled by the [Levels of Connections](#levels-of-connections) toggle). Information is filled about the researcher under the [Graph Detail](#graph-details) and [Similar Researchers](#similar-researchers) sections of the [Side Panel](#side-panel). 

To exit this mode and display the full graph again, the user must click anywhere outside the graph. 


## Side Panel

The side panel is broken into two parts, the [Graph Legend](#graph-legend) and the [Graph Details](#graph-details). When a researcher is selected, the side panel will display another dropdown called [Similar Researchers](#similar-researchers).

![alt text]()

### Graph Legend 

The graph legend displays which faculty is represented by its respective color in a list. By selecting specific faculty filters from the [Filters](#filters), the graph legend will display which faculty filters are currently applied. 

### Graph Details 

The graph details section is filled once a researcher node is selected. This shows specific details of the currently selected researcher as well as the option to show different levels of connections. 

#### Levels of Connections

This part of the graph details allows the user to control the level of connections of the currently selected researcher. This means the user can see mutual researcher connections that are 2 or 3 edges away and the graph will be updated as such.  

### Similar Researchers

The similar researchers section appears once a researcher node is selected. This shows researchers that share similar keywords/research topics with the currently selected researcher, ordered from most to least shared keywords/topics, and is limited to the top 5 most similar researchers. The information of each similar researcher consists of their name, faculty and list of shared keywords/topics. 

## Filters

The filters allow the user to select which faculties and keywords to filter the graph by. By clicking the button `Filter the Graph` at the top right, a modal will pop up with all the filter options. Faculty filters are selected by clicking the box next to the filter. Keyword filters are entered in the text field and **must** be comma separated. The keyword filtering is case **insensitive**. The keyword filtering works by finding researchers that match all the keywords that are entered (Eg. by entering `genetics, covid` the graph will be filtered by researchers that have the keywords `genetics` **AND** `covid`). To apply the filters, click the `Apply Filters` button at the bottom of modal. 

![alt text](images/userGuide/publications01.png)


![alt text](images/userGuide/advancedSearch01.png)

## Website Tour 

The website tour first appears when the user logs into the website or can be started again by pressing the [Start Tour](#start-tour--update-this-when-actually-updated-on-frontend) button. This gives the user a step-by-step rundown of the functionalities of the website. The user may also skip this by clicking on `Skip` at any point of the tour. 

## Options 

### Start Tour (?) update this when actually updated on frontend

Allows the user to restart the website tour

### Logout 

Logs the user out of the app 

## Updating Researchers

### Step 1: Upload Data to S3

1. Follow this [link](https://www.scival.com/overview/authors?uri=Institution/501036) to the Scival page for your Institution and sign in. Click on the `Export` dropdown menu then click `Download full list of authors (CSV)`. Rename the file to `scopus_ids.csv`.
   ![alt text](images/deploymentGuide/scival_download.jpg)
2. Ensure you have a file containing researcher HR data. An example of how this file should be structured can be found here: [Example HR Data File](example_data/hr_data(example).csv). This file must be named `institution_data.csv`. Note that the `INSTITUTION_USER_ID` column could represents any types of **unique ids** (employee id from institution's HR data, uuid from the institution's external database, etc), and each ids must be associated with one person(researcher) only.
3. At the [AWS online console](https://console.aws.amazon.com/console/home), enter `S3` in the search bar.
   ![alt text](images/deploymentGuide/s3_search.jpg)
4. In the `Buckets` search bar enter `vpri-innovation-dashboard` and click on the name of the bucket.
   ![alt text](images/deploymentGuide/s3_bucket_search.jpg)
5. Click on the `researcher_data` folder.
   ![alt text](images/userGuide/folder_select.jpg)
6. Select the `institution_data.csv` and `scopus_ids.csv` files (also select the `manual_matches.csv` file if it is present) and click `Delete`
   ![alt text](images/userGuide/file_select.jpg)
7. Type `permanently delete` in the text input field then click `Delete objects`.
   ![alt text](images/userGuide/file_deletion.jpg)
8. Click `Close` once the deletion is finished.
   ![alt text](images/userGuide/deletion_close.jpg)
9. Click `Add Files` and select the `scopus_ids.csv` file from part 1 and the `institution_data.csv` file from part 2 (also if you have a file of manually matched researcher profiles upload them as well. The file must be named `manual_matches.csv` and should be structured like the following file: [Example Matches File](example_data/manual_matches(example).csv)) then click `Upload`.
   ![alt text](images/deploymentGuide/s3_upload.jpg)
10. Once the upload is complete click `Close`
   ![alt text](images/deploymentGuide/s3_upload_complete.jpg)

### Step 2: Run the Data Pipeline

1. At the [AWS online console](https://console.aws.amazon.com/console/home), enter `Step Functions` in the search bar.
   ![alt text](images/deploymentGuide/step_function_search.jpg)
2. In the State Machine search bar enter `DataFetchStateMachine` and click the name of the top result (The exact name of the state machine may vary but it will always begin with `DataFetchStateMachine`.
   ![alt text](images/deploymentGuide/state_machine_search.jpg)
3. Click `Start Execution`
   ![alt text](images/deploymentGuide/state_machine_page.jpg)
4. In the box that appears click `Start Execution`. Do not edit the text in the input field.
   ![alt text](images/deploymentGuide/start_execution.jpg)
5. The data pipeline will now run on its own and populate the database. This process will take ~90 minutes. If you navigate to the page you visited in part 2 of this step you can view the status of the data pipeline. Once it is finished running the step function execution status will say `Succeeded`.
   ![alt text](images/deploymentGuide/state_machine_success.jpg)

## Updating Grant Data

**NOTE**: grant data should be updated every 6 months or so.

1. Refer to the [User Guide to Grant Downloads](User%20Guide%20to%20Grant%20Downloads.pdf) for instructions on how to obtain the grant data for your institution.
2. At the [AWS online console](https://console.aws.amazon.com/console/home), enter `S3` in the search bar. Find the bucket whose name starts with `grantdatastack-grantdatas3bucket` (the full name will have some random alpha-numeric letter after that initial identifier).
3. There are a folder called `raw` already created for you at deployment, and it contains 4 subfolders (`cihr`, `cfi`, `nserc`, `sshrc`). Inside each of the subfolder, put the corresponding CSV file for that grant there. For SSHRC, please also remember to include the `sshrc_program_codes.csv` file along with the SSHRC grant data CSV file. The resulting folder structure should look like this:
   ![alt text](images/deploymentGuide/grant-data-folder-structure.png)

**NOTE**:

+ If you found out that you there was a mistake in the uploading process, either you put the wrong files in the wrong folders, or there were extra files uploaded accidentally, then you should **delete the wrong file** then **wait for 20 minutes and redo the uploading process**. 
+ In the extremely unlikely situation that you do not see the `raw` folder and its 4 subfolders automatically created during **first-time deployment**, you can also manually create the `raw` folder first, then the 4 subfolders inside.

4. If the uploading process was performed correctly, the Grant Data Pipeline will automatically be invoked and the new data will show up in the RDS PostgreSQL database after around 20 min or so.

5.  After around 20 minutes, navigate to the S3 bucket that you uploaded the grant earlier. If you're still having that page open, simply refresh the page. If this Grant Data Pipeline has successfully executed, you should see another 2 folders being added (**clean** and **ids-assigned**) in addition to your **raw** folder.
   ![alt text](images/deploymentGuide/grant-data-s3-bucket-done.png)

6.  By going into those 2 new folders, you should see that they have a **similar subfolder structure to raw**. You dont have to do anything further.
   ![alt text](images/deploymentGuide/grant-data-s3-bucket-clean.png)
   ![alt text](images/deploymentGuide/grant-data-s3-bucket-ids-assigned.png)

7.  If you see that a folder(s) is missing. Please wait for another 10 or so minutes because this could be a latency issue. If you came back and check and that missing folder still has not show up, then it is possible that a wrong file was uploaded in **raw** folder. Please double check your **raw** folder and follow the instructions above to reupload accordingly.

