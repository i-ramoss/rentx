# Writing the application requirements

The most important thing before we even choose the technology to be used in a project, the database, whether it will Docker or not... is that we have defined and mapped out what are the requirements of the application, what the application will do, what are the rules behind each functionality, what you can and cannot do

The analyst, who is the person responsible for bridging the gap between the development team and the client, goes to the customer and makes the entire survey of what the system needs, what the customer expects the system to have. Within this conversation with the client, he will map the functional, non-functional requirements, the business rules...

So, for us to understand, to be able to map and look better at our application we will start writing the requirements of the application.

It is always good that we can pass as much information during the listing of requirements and business rule

### Functional Requeriments ⇒ FR

These are the features that our app will be able to have:

- User will be able to register a category
- The user will be able to recover his email password
- ...

### Non-functional Requeriments ⇒ NFR

Are requirements that are not directly linked to the application’s business rule

- The data must be saved in a Postgres database.
- Know which library to use, something related to email, database...

### Business Rules ⇒ BR

These are the de facto rules behind our functional requirements. 

- It should not be possible to register a category with an existing name
- It shall not be possible to register a category with a nameless than 4

## Car registration

### FR:

- [x] It must be possible to register a new car.

### BR:

- [x] * The user responsible for registration must be an administrator user.
- [x] It must not be possible to register a car with an existing license plate.
- [x] The car must be registered, by default, as available.

## Car listing

### FR:

- [x] It must be possible to list all available cars.
- [x] It must be possible to list all available cars by category.
- [x] It must be possible to list all available cars by making.
- [x] It must be possible to list all available cars by car name.

### BR:

- [x] The user does not need to be logged into the system.

## Registration of Specification on the car

### FR:

- [x] It must be possible to register a specification for a car.

### BR:

- [x] It must not be possible to register a specification for an unregistered car.
- [x] It must not be possible to register a specification for the same car.
- [x] The user responsible for registration must be an administrator user.

## Registration of car images

### FR:

- [x] It must be possible to register the image of the car.

### NFR:

- [x] Set multer for uploading files.

### BR:

- [x] The user must be able to register more than one image for the same car.
- [x] The user responsible for registration must be an administrator user.

## Car rental

### FR:

- [x] It must be possible to register a rental.

### BR:

- [x] The rental must have a minimum duration of 24 hours.
- [x] It must not be possible to register a new rental if there is already one open for the same user.
- [x] It should not be possible to register a new rental if there is already one open for the same car.
- [x] The user must be logged in to the application to rent.
- [x] When renting, the status of the car must be changed to unavailable.

## Car return

### FR:

- [x] It must be possible to return a car.

### BR:

- [x] If the car is returned with less than 24 hours, it will be charged full night.
- [x] When returning, the car must be released for another rental.
- [x] When making the return, the user must be released for another rental.
- [x] When returning, the total rent must be calculated.
- [x] If the return time is longer than the expected delivery time, a fine will be charged proportionally to the days of delay.
- [x] If there is a fine, it must be added to the total rent.
- [x] The user must be logged in to the application to rent

## Listing of rentals for users

### FR:

- [x] It must be possible to search all rentals for the user.

### BR:

- [x] The user must be logged in to the application.

# Recover Password

### FR:

- [x] It must be possible for the user to retrieve the password by informing the email.
- [x] User should receive an email with step-by-step password recovery.
- [x] User should be able to enter a new password.

### BR:

- [x] User needs to enter a new password.
- [x] Link sent for recovery must expire in 3h (or less).
