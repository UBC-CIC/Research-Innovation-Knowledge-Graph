# User Guide

**Before Continuing with this User Guide, please make sure you have deployed the frontend and backend stacks.**

- [Deployment Guides](./DeploymentGuide.md)

| Index                                                      | Description                                           |
| :--------------------------------------------------------- | :---------------------------------------------------- |
| [Home](#Home)                                              | Home Page                                             |
| [Main Graph](#Main-Graph)                                  | Main graph (Displays all Researchers)                 |
| [Researchers Search](#Researchers-Search)                  | Researcher search bar (By name)                       |
| [Side Panel](#Side-Panel)                                  | Additional information about the graph                |
| [Filters](#Filters)                                        | Filters for the graph                                 |
| [Researcher Node Selection](#Researcher-Node-Selection)    | Researcher profile and information page               |
| [Updating Researchers](#Updating-Researchers)              | Process for Updating Researcher Data                  |

**Note:** The screenshots contained in this User Guide show some information as redacted to obscure data that is not fully up to date.
<br>

## Home

The Home page displays the main view of the website and all components. This includes the [Main Graph Component](#main-graph), [Searchbar Component](#researchers-search), [Filters](#Filters), and the [Side Panel](#Side-Panel).

![alt text](images/userGuide/home01.png)
![alt text](images/userGuide/home02.png)

#### NOTE: "Innovation Connections" logo in this document may be replaced by the institution logo that will deploy this solution. 

## Main Graph

The main graph displays all the researchers in the graph, where each researcher is represented as a node and an edge is the connection between two researchers. The color of each node represents which faculty they are in. Opening the [Graph Legend](#Graph-Legend) on the [Side Panel](#Side-Panel) will display which color represents which faculty. The thickness of the edge represents how well connected two researchers are, and this metric is determined by the number of papers the researchers share. 

## Researchers Search

The search bar allows the user to search for a specific researcher by their name. As you type into the search bar, a dropdown list of suggested researchers that match the current string appears. Clicking on a node zooms into the selected researcher ([Researcher Node Selection Mode](#Researcher-Node-Selection)).

![alt text](images/userGuide/researchers01.png)

Clicking on the `Show All` button will open a window displaying all the possible options for the filter category. To select the options you would like to filter by, click the checkbox beside the option name. Then click `Apply Filters`. Multiple filter options can be selected from both the Department and Faculty category.

![alt text](images/userGuide/researchers02.png)

## Side Panel

The side panel is broken into two parts, the [Graph Legend](#graph-legend) and the [Graph Details](#graph-details). 

### Graph Legend 

The graph legend displays which faculty is represented by its respective color as a list. As well, by selecting specific faculty filters from the [Filters](#filters), the graph legend will display which faculties are currently being filtered on. 

![alt text]()

### Graph Details 



## Filters

The filters allow the user to select which faculties they want to filter to graph by. There is also the option to filter the graph by specific keywords. They keywords must be comma separated and the filtering is case **insensitive**. The keyword filtering works by selecting researchers that match all the keywords that are entered. (Eg. by entering `genetics, covid` the filter will select researchers that have the keywords `genetics` **AND** `covid`)

![alt text](images/userGuide/publications01.png)

To select the journal options you would like to filter by, click the journal name and the selected journal will appear above the dropdown menu.
![alt text](images/userGuide/publications02.png)

## Researcher Node Selection

The advanced search page offers a more detailed method of finding information on the website, and increases search accuracy by allowing users to specify additional requirements for a search.

The advanced search page can be accessed by clicking the `Advanced Search` button underneath the search bar in either the Home tab (will return results for both researchers and publications), Researchers tab (will only return results for researchers) or Publications tab (will only return results for publications).

![alt text](images/userGuide/advancedSearch01.png)

There are 4 possible advanced search fields.

1. Include All These Words

   - Separate each key word with a space character
   - eg. If you would like the words "Covid-19" and "pandemic" to both be included in your search results, enter `Covid-19 pandemic` into the text field.

2. Include These Exact Phrases

   - Enter the phrase you would like to search for in quotation marks
   - eg. If you would like a publication to include the phrase "Covid-19 Pandemic Effects", enter `"Covid-19 Pandemic Effects"` into the text field.

3. Include Any Of These Words

   - Separate each key word with a space character
   - eg. If any of the words "Covid-19", "pandemic", or "effects" can be included in your search results, enter `Covid-19 pandemic effects` into the text field.

4. Do Not Include Any Of These Words

   - Separate each key word that cannot be included with a minus (-) character
   - eg. If you do not want any of the words "Covid-19", "pandemic", or "effects" to be included in your search results, enter `-Covid-19 -pandemic -effects` into the text field.

![alt text](images/userGuide/advancedSearch02.png)

<br>

Search results can also be refined by filtering researchers by department or by faculty. Publications can be filtered by year and by journal.
<br>
![alt text](images/userGuide/advancedSearch03.png)


## Researcher Profile

The researcher profile page contains general information about a researcher, their publications, areas of interest and a list of similar researchers.

### General Information

The researcher's general information including name, faculty, department, email, phone number, office Scopus ID, and time last updated are displayed here.
<br>
![alt text](images/userGuide/researcherProfile01.png)

### Researcher Highlights

Some of the researcher's highlights are displayed here, including their number of publications, H-index, funding and a graph displaying their number of publications each year for the past five years.
![alt text](images/userGuide/researcherProfile02.png)

Clicking on the expand arrow icon on the smaller graph will display a graph below that shows the number of publications each year for the past 15 years.
![alt text](images/userGuide/researcherProfile04.png)
![alt text](images/userGuide/researcherProfile03.png)

### Areas of Interest and Similar Researchers

This section displays a list of the researcher's areas of interest. The researcher's top five areas of interest are shown by default. To view all, click the `View All Areas of Interest` button.
<br>
![alt text](images/userGuide/researcherProfile05.png)
Clicking the `10 Similar Researchers` button will display a list of researchers that are in the same faculty, department, or have similar areas of interest.
![alt text](images/userGuide/researcherProfile06.png)

### Publications

This section displays a list of the researcher's publications, along with information about the number of citations and the year published. Clicking on the publication title will open the publication in Scopus.
<br>
![alt text](images/userGuide/researcherProfile07.png)

Hovering over the `Title` table column header will display an arrow icon. Clicking on this arrow icon will show the list of publications in alphabetical order.
![alt text](images/userGuide/researcherProfile08.png)
![alt text](images/userGuide/researcherProfile09.png)

Hovering over the `Year Published` table column header display an arrow icon. Clicking on this arrow icon will sort the publications by year published starting from the most recent year.
![alt text](images/userGuide/researcherProfile10.png)

## Impact

The Impact tab displays a table with all researchers sorted by their H index for the past 5 years. Researcher impact can be filtered by department or by faculty by clicking on the `Impact By Department` or `Impact By Faculty` toggle tabs above the impacts table.
![alt text](images/userGuide/rankings01.png)

## Metrics

The Metrics tab displays a word cloud containing the top 100 keywords in the Institution's research during a user selected date range. The font size of each word in the word cloud corresponds to the frequency that that word has appeared in publication titles during the selected date range. The earliest available year is 1908, and the latest available year is the current year.
![alt text](images/userGuide/metrics01.png)

The selected date range can be changed by moving either one of the date range slider buttons. A new word cloud will then be formed with the words for the updated date range.

![alt text](images/userGuide/metrics03.png)

To view the exact number of times a certain keyword has appeared, hover over the word and a popup will appear. If you would like to search for that keyword, click the word to open a new tab containing the search results.
![alt text](images/userGuide/metrics02.png)

## Admin Dashboard

The admin dashboard page is only accessible by admin users. Once the user has logged in, this page is used for viewing logs of when data has been updated on the site, changing Scopus IDs of researchers on the site, and viewing any discrepancies in researcher entries.

The admin dashboard page contains three tabs.
![alt text](images/userGuide/adminDashboard03.png)

### 1. Logs

The Logs tab contains two tables. The first table displays logs of the time at which publications are updated, as well as the number of publications that are updated.
![alt text](images/userGuide/adminDashboard04.png)
The second table displays logs of the time at which researchres are updated, as well as the name of the researcher that are updated.
![alt text](images/userGuide/adminDashboard05.png)

### 2. Change Scopus IDs

The Change Scopus IDs tab allows admin users to change the Scopus ID of any researcher. To change a Scopus Id, begin by entering the current researcher Scopus ID that you would like to change. Then click `Look Up Scopus ID`.
![alt text](images/userGuide/adminDashboard01.png)
This will open a window displaying the information of the researcher associated with that Scopus ID. Enter the new Scopus ID in the text field beside `Input New Scopus ID:`. Then click the `Change Scopus ID` button on the lower right hand side of the window.
![alt text](images/userGuide/adminDashboard02.png)

### 3. Flagged IDs

The flagged IDs tab displays researchers that have had their Scopus ID flagged. At the top of the page, there will be a message showing how many researchers there currently are with flagged IDs.
![alt text](images/userGuide/adminDashboard06.png)

Below that, flagged researcher entries are grouped into tables with the columns containing Researcher Name, Scopus ID, Employee ID, Department, Faculty and Reason Flagged information.
![alt text](images/userGuide/adminDashboard07.png)

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

