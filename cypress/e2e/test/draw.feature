Feature: User can creat a box and make a draw
@login
Scenario: Author logs in successfully
Given user-author is on secret santa login page
When user-author logs in as "melihova.qa@gmail.com" and "Test1234"
Then user-author is on dashboard page and see 'creat a box'

@creatBox
Scenario: Author can successfully creat a box
When user-author clicks on 'Creat box' button
And user-author completes the steps of box creating
Then user-author successfully created the box

@cards
Scenario: Author can create a cards in the box
When user-author clicks on 'add participants' button
And user-author fills the filds in
| name          | email                 |
| Natalia2      | natmeltest@gmail.com  |
| Natalia3      | natmeltest1@gmail.com |
| Natalia-author| melihova.qa@gmail.com |
Then box contains 3 cards

@draw
Scenario: Author can make a draw
When user-author clicks on 'back to the box' button
And user-author clicks link 'go to the draw'
And user-author clicks on 'start a draw' button
And user-author clicks on confirmation button
Then user-author has successfully made a draw

@authorNotification
Scenario: Author recieved notifications
Given user-author clicks notifications buuton
Then user-author can see a notification

@userNotification
Scenario: Participants recieved notification
Given user login as "<email>" and "<password>" in to the account
When user clicks notifications button
Then user can see notification 
Examples:
    | email | password |
    | natmeltest@gmail.com  | Test1234 | 
    | natmeltest1@gmail.com | Test1234 |


