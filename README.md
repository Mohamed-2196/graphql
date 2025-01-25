# **Profile Page with GraphQL Integration** 🚀

This project is a **personalized profile page** that fetches user data from a GraphQL API and displays it in an interactive and visually appealing way. Inspired by the iconic **Matrix movie theme** 🎥, the project features a dynamic **Matrix-like background animation** 🌌 and a sleek, futuristic design. It includes a **login page** for authentication, a **profile page** to showcase user information, and **statistical graphs** to visualize user progress and achievements. The project is built using **React.js**, **GraphQL**, and **ApexCharts** for dynamic data visualization.

---

## **Live Demo** 🌐

The project is hosted and can be accessed here:  
👉 **[https://mohamed-2196.github.io/graphql/](https://mohamed-2196.github.io/graphql/)**

---

## **Features** ✨

1. **Login Page** 🔐:
   - Secure login using **username/email** and **password**.
   - JWT-based authentication for accessing the GraphQL API.
   - Error handling for invalid credentials.
   - Logout functionality.

2. **Profile Page** 👤:
   - Displays user information:
     - First name, last name, email, and username.
     - XP amount, audit ratio, and level.
     - Cohort information (e.g., Cohort 1, Cohort 2, Cohort 3).
   - **Statistics Section** with interactive graphs:
     - **Audit Ratio Chart**: Visualizes the ratio of audits passed vs. failed.
     - **User Level Distribution by Cohort**: A histogram showing user levels across cohorts.
     - **XP Distribution Pie Chart**: Displays XP earned across different projects.
     - **Radar Chart**: Shows proficiency in technical skills and technologies.

3. **User Ranking** 🏆:
   - Displays a ranked list of users based on their levels.
   - Filter ranking by cohort (Cohort 1, Cohort 2, Cohort 3).

4. **Matrix Movie Theme** 🎬:
   - Dynamic **Matrix-style background animation** for a futuristic look.
   - Sleek and modern UI design inspired by the Matrix aesthetic.

5. **Responsive Design** 📱:
   - The UI is designed to be responsive and works seamlessly on different screen sizes.

---

## **Technologies Used** 🛠️

- **Frontend**:
  - React.js
  - ApexCharts for interactive charts.
  - CSS for styling and layout.
- **Backend**:
  - GraphQL for querying user data.
  - JWT for authentication and authorization.
- **Hosting**:
  - Hosted on **GitHub Pages**.

---

## **How to Run the Project** 🏃‍♂️

1. **Prerequisites**:
   - Install **Node.js** and **npm** (Node Package Manager) on your machine.
   - Clone the repository:
     ```bash
     git clone https://github.com/Mohamed-2196/graphql.git
     ```

2. **Install Dependencies**:
   - Navigate to the project directory and run:
     ```bash
     npm install
     ```

3. **Run the Project**:
   - Start the development server:
     ```bash
     npm start
     ```
   - The application will open in your default browser at `http://localhost:3000`.

4. **Login**:
   - Use your **username/email** and **password** to log in.
   - If the credentials are valid, you will be redirected to your profile page.

5. **Explore the Profile Page**:
   - View your personal information, audit ratio, and cohort details.
   - Interact with the graphs to visualize your progress and achievements.

---

## **GraphQL Queries** 🔍

The project uses the following GraphQL query to fetch user data:

```graphql
query User {
  user {
    auditRatio
    email
    firstName
    lastName
    login
    totalDown
    totalUp
    groupsByCaptainid {
      campus
      captainId
      captainLogin
      createdAt
      eventId
      id
      objectId
      path
      status
      updatedAt
    }
  }
  event_user(where: { eventId: { _in: [72, 20, 250] } }) {
    level
    userId
    userLogin
    eventId
  }
  transaction {
    amount
    path
    type
    userLogin
    eventId
  }
}
```

---

Enjoy exploring your profile and visualizing your achievements in a **Matrix-inspired world**! 🚀
