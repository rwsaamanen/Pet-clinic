# Pet Clinic MERN Application

The final project is an innovative web application designed as a Pet Clinic management system. It offers a user-friendly interface, developed in React with TypeScript for the front-end, ensuring a seamless experience for pet owners and veterinarians. The back-end is powered by Node.js and Express. This system allows pet owners to register their pets, while veterinarians can securely add private medical notes accessible only to medical staff. Additionally, vets can share public remarks with pet owners regarding their pet's health. For data storage and management, the application utilizes MongoDB, a flexible and scalable database. This choice complements the application's focus on efficient data retrieval and management, key aspects in the seamless operation of our pet clinic services.

## Demo Video about the application

https://github.com/rwsaamanen/pet-clinic/assets/98338543/7221b239-200d-4b8b-a203-92e81e94933b


## Management system

### Account creation:

* When a new user registers, they are automatically assigned the default role of a 'Pet Owner'.
* To ensure security and privacy, the application implements JSON Web Tokens (JWT) for authentication. Furthermore, for added security, users' passwords are hashed.

### User Roles:

#### Pet Owner:

##### Pet Management

* Pet Owners can view and manage details related to their own pets.

    * Booking: They have the ability to book visits for their pets.
    * Data Access: Access to view data specific to their pets, including public remarks from doctors.

#### Doctor:

##### Comprehensive Access

* Doctors can view all pets and their visit history stored in the database.
    * Pet Management: Ability to add new pets into the system.
    * Medical Notes: Exclusive access to add and view Medical Notes, which are private and only visible to users with a Doctor role.
    * Public Remarks: Can add remarks about a pet's health or visit, which are visible to both the Doctors and the respective Pet Owner.
    * Pet and Visit Overview: Doctors have permissions to oversee all pets and their visit details in the application.

### Role-Based Permissions:

* Pet Owner 
    * Limited Access: View and manage their own pets' details.
    * Booking Privileges: Can book visits for their pets.
    * Public Remarks: Access to view public remarks made by Doctors regarding their pets.
* Doctor
    * Full Access: Can view all pets and visit details in the database.
    * Medical and Public Notes: Ability to add and view private Medical Notes; can also add Public Remarks visible to Pet Owners.
    * Pet Management: Can add new pets and oversee all pet-related data.
    * Role-Specific Visibility: Exclusive access to Medical Notes, ensuring privacy and confidentiality in patient care.



## Built With

### Front

* React.tsx
* React Routers
* Axios
* Tailwind CSS
* Shadcn/ui

### Back

* Node.js
* Experss

### Data
* MongoDB Atlas


## Getting Started

### Users to test the application

#### With a Doctor role

* Username: rwsaamanen@gmail.com
* Password: Admin

* Username: doctor@pets.com
* Password: Pet1234

#### With a Pet Owner role:

* Username: owner1@test.com
* Password: qwerty

* Username: owner2@woof.net
* Password: Bark!

* Username: owner3@abc.org
* Password: _Dog2023

### Prerequisites

* Node.js

In client directory run this:

* npm
  ```sh
  npm install npm@latest -g
  ```

  NOTE*
To run the backend, you'll need a connection to Vaasa's University of Applied Sciences.

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/rwsaamanen/pet-clinic.git
   ```
3. Install NPM packages ( in client and server directories ).
   ```sh
   npm install
   ```
4. API Keys

    * In this code I have MongoDB connection string published. Note that the code does not have anything private.

5. Run front in client root directory
   ```sh
   npm run dev
   ```
6. Run server in server directory
   ```sh
   npm start
   ```



## Contributing

Contributions are not currently accepted or incorporated into the system's functionality.

