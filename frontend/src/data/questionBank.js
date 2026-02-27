// src/data/questionBank.js
// Local question bank — no API needed to generate questions.
// Each question has: id, topic, title, description, tableHint

const questionBank = {
  easy: [
    {
      id: 'e1',
      topic: 'Joins',
      title: 'Customer Orders Count',
      description:
        'Write a SQL query to find the names of all customers and the total number of orders each customer has placed. Include customers who have placed zero orders.',
      tableHint: 'Tables: customers(id, name, email), orders(id, customer_id, amount, created_at)',
    },
    {
      id: 'e2',
      topic: 'Aggregation',
      title: 'Department Average Salary',
      description:
        'Write a query to find the average salary for each department. Only include departments that have at least 2 employees.',
      tableHint: 'Tables: employees(id, name, salary, department_id), departments(id, name)',
    },
    {
      id: 'e3',
      topic: 'Aggregation',
      title: 'Top Earning Employee',
      description:
        'Find the employee with the highest salary in the company. If there is a tie, return all tied employees.',
      tableHint: 'Tables: employees(id, name, salary, department_id)',
    },
    {
      id: 'e4',
      topic: 'Joins',
      title: 'Products Never Ordered',
      description:
        'Write a query to list all products that have never been ordered by any customer.',
      tableHint: 'Tables: products(id, name, price), order_items(id, order_id, product_id, quantity)',
    },
    {
      id: 'e5',
      topic: 'Aggregation',
      title: 'Monthly Sales Total',
      description:
        'Calculate the total revenue generated each month in the year 2024. Format the output as month name and total sales, ordered chronologically.',
      tableHint: 'Tables: orders(id, total_amount, status, created_at)',
    },
  ],

  medium: [
    {
      id: 'm1',
      topic: 'Subqueries',
      title: 'Employees Earning Above Department Average',
      description:
        'Find all employees whose salary is greater than the average salary of their own department. Return employee name, department name, salary, and department average.',
      tableHint: 'Tables: employees(id, name, salary, department_id), departments(id, name)',
    },
    {
      id: 'm2',
      topic: 'Window Functions',
      title: 'Running Sales Total',
      description:
        'Write a query to calculate the running (cumulative) total of order amounts ordered by date. Include order_id, order_date, amount, and running_total in the result.',
      tableHint: 'Tables: orders(id, customer_id, amount, created_at)',
    },
    {
      id: 'm3',
      topic: 'Joins',
      title: 'Managers With Most Reports',
      description:
        'Find the top 3 managers who have the most direct reports. Return manager name and their report count. The employees table is self-referential.',
      tableHint: 'Tables: employees(id, name, salary, manager_id) — manager_id references employees.id',
    },
    {
      id: 'm4',
      topic: 'Subqueries',
      title: 'Second Highest Salary Per Department',
      description:
        'Find the second highest salary in each department. If a department only has one salary, still include that department with NULL as the second highest.',
      tableHint: 'Tables: employees(id, name, salary, department_id), departments(id, name)',
    },
    {
      id: 'm5',
      topic: 'Aggregation',
      title: 'Customer Retention Rate',
      description:
        'Find all customers who placed an order in January 2024 AND also placed an order in February 2024. Return their names and total amount spent across both months.',
      tableHint: 'Tables: customers(id, name), orders(id, customer_id, amount, created_at)',
    },
  ],

  hard: [
    {
      id: 'h1',
      topic: 'Window Functions',
      title: 'Employee Salary Ranking With Dense Rank',
      description:
        'For each department, rank all employees by salary using DENSE_RANK. Also show the difference between each employee\'s salary and the highest earner in their department. Return all employees sorted by department name, then rank.',
      tableHint: 'Tables: employees(id, name, salary, department_id), departments(id, name)',
    },
    {
      id: 'h2',
      topic: 'Subqueries',
      title: 'Find Gaps in Sequential IDs',
      description:
        'The orders table has sequential IDs but some records were deleted, creating gaps. Write a query to find all missing order IDs between the minimum and maximum ID in the table.',
      tableHint: 'Tables: orders(id, customer_id, amount, created_at) — some IDs are missing',
    },
    {
      id: 'h3',
      topic: 'Window Functions',
      title: 'Month-over-Month Revenue Growth',
      description:
        'Calculate the month-over-month revenue growth percentage for each month in 2024. Include: month, total_revenue, previous_month_revenue, and growth_percentage. Show NULL for the first month.',
      tableHint: 'Tables: orders(id, amount, status, created_at) — only count status = delivered',
    },
    {
      id: 'h4',
      topic: 'Joins',
      title: 'Product Recommendation Engine',
      description:
        'Find pairs of products that are frequently bought together (appear in at least 3 of the same orders). Return product1_name, product2_name, and times_bought_together, sorted by frequency descending.',
      tableHint: 'Tables: products(id, name), orders(id), order_items(id, order_id, product_id, quantity)',
    },
    {
      id: 'h5',
      topic: 'Subqueries',
      title: 'Consecutive Login Streak',
      description:
        'Find all users who have logged in for at least 5 consecutive days. Return user_id, user_name, and their longest consecutive login streak. Use the user_logins table which may have duplicate dates per user.',
      tableHint: 'Tables: users(id, name), user_logins(id, user_id, login_date)',
    },
  ],
};

export default questionBank;
