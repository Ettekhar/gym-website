const express = require('express');
const router = express.Router();
const pool = require('../database.js'); // Make sure this is your database connection pool
const moment = require('moment-timezone');

const { createUser, getUser, UpdateUser } = require('../Models/users.js');
const { getPlan } = require('../Models/plan.js');
const { createEnroll, UpdateEnroll, getEnroll, getEnrollByUid } = require('../Models/enroll.js');
const { createHealthStatus, UpdateHealthStatus } = require('../Models/healthStatus.js');
const { createAddress, UpdateAddress } = require('../Models/address.js');

// Route to get revenue for the month
router.get('/revenue-month', async (req, res) => {
  try {
    const date = new Date().toISOString().slice(0, 7); // Get current year-month format
    const [result] = await pool.query(`
      SELECT SUM(p.amount) AS revenue 
      FROM enrolls_to e 
      JOIN plan p ON e.pid = p.pid 
      WHERE e.paid_date LIKE ?
    `, [`${date}%`]);
    console.log(result)
    res.json({ revenue: result[0].revenue });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get total members
router.get('/total-members', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT COUNT(*) AS totalMembers FROM users');
    res.json({ totalMembers: result[0].totalMembers });
    console.log(result)
  } catch (error) {
    console.error('Error fetching total members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get members joined this month
router.get('/joined-this-month', async (req, res) => {
  try {
    const date = new Date().toISOString().slice(0, 7); // Get current year-month format
    const [result] = await pool.query(`
      SELECT COUNT(*) AS joinedThisMonth 
      FROM users 
      WHERE joining_date LIKE ?
    `, [`${date}%`]);
    console.log(result)
    res.json({ joinedThisMonth: result[0].joinedThisMonth });
  } catch (error) {
    console.error('Error fetching joined this month:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get total plans
router.get('/total-plans', async (req, res) => {
  try {
    const [result] = await pool.query("SELECT COUNT(*) AS totalPlans FROM plan WHERE active='yes'");
    res.json({ totalPlans: result[0].totalPlans });
  } catch (error) {
    console.error('Error fetching total plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to register a new member
router.post('/register', async (req, res) => {
  try {
    const { m_id, u_name, street_name, city, zipcode, state, gender, dob, mobile, email, jdate, plan } = req.body;

    // Insert into users table
    const [userResult] = await createUser(m_id, u_name, gender, mobile, email, dob, jdate)
    // console.log(userResult)

    // Retrieve information of selected 
    const [planResult] = await getPlan(plan)
    // console.log(planResult)

    // Calculate expiration date based on selected plan
    const planExpirationDate = moment().tz('Asia/Dhaka').add(planResult.validity, 'months').format('YYYY-MM-DD');
    // console.log({planExpirationDate});

    // Insert into enrolls_to table
    const [enrollResult] = await createEnroll(plan, m_id, jdate, planExpirationDate, 'yes');
    // console.log(enrollResult)

    // Insert into health_status table
    const [healthResult] = await createHealthStatus(null, null, null, null, null, m_id)
    console.log(healthResult)

    // Insert into address table
    const [addressResult] = await createAddress(m_id, street_name, state, city, zipcode);
    console.log(addressResult)

    res.status(200).json({ message: 'Member registered successfully' });

  } catch (error) {

    if (error.errno === 1062) {
      const match = error.sqlMessage.match(/for key '([^']+)'/);
      const key = match ? match[1] : null;
      if (key === 'email') {
        return res.status(500).json({ error: error, code: 'email' })
      }
      if (key === 'PRIMARY') {
        return res.status(500).json({ error: error, code: 'primary' })
      }

    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});


// Route to get members with renewal='yes'
router.get('/renewals', async (req, res) => {
  try {
    const query = `
      SELECT e.uid, e.pid, e.expire, u.username, u.userid, u.mobile, u.email, u.gender
      FROM enrolls_to e
      JOIN users u ON e.uid = u.userid
      WHERE e.renewal = 'yes'
      ORDER BY e.expire
    `;
    const [results] = await pool.query(query);

    // Map the results to the format expected by the frontend
    const payments = results.map((row, index) => ({
      userID: row.uid,
      expire: row.expire,
      username: row.username,
      mobile: row.mobile,
      email: row.email,
      gender: row.gender,
      planID: row.pid
    }));

    res.json(payments);
  } catch (error) {
    console.error('Error fetching renewal data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MAKE PAYMENT 
router.post('/make-payment', async (req, res) => {
  try {
    const { m_id, plan } = req.body;
    
    // Update renewal status to 'no' for the current membership
    const [data] = await getEnrollByUid(m_id, 'yes');
    console.log('make-payment:')
    console.log(data);
    // console.log({data,m_id,plan});
    // await UpdateEnroll(m_id, { renewal: 'no' });
    await UpdateEnroll(data.et_id, data.pid, m_id, data.paid_date, data.expire, 'no')

    // Retrieve information of the selected plan
    const [planResult] = await getPlan(plan);

    // Calculate the expiration date based on the selected plan
    const planExpirationDate = moment().tz('Asia/Dhaka').add(planResult.validity, 'months').format('YYYY-MM-DD');

    // Update membership with the new enrollment details
    await createEnroll(plan, m_id, moment.tz("Asia/Dhaka").format("YYYY-MM-DD"), planExpirationDate, 'yes');

    res.status(200).json({ message: 'Payment successfully processed' });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/member', async (req, res) => {
  try {
    // userid,username,gender,mobile,email,dob,joining_date,expire
    const [result] = await pool.query(`
    SELECT
    *
    FROM
        users
    LEFT JOIN enrolls_to ON users.userid = enrolls_to.uid
    WHERE enrolls_to.renewal IS NULL OR enrolls_to.renewal <> 'no'
    `, []);
    console.log(result)
    res.json(result);
  } catch (error) {
    console.error('Error fetching Member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Edit Member
router.get('/editMember/:id', async (req, res) => {
  try {
    // userid,username,gender,mobile,email,dob,joining_date,expire
    const [result] = await pool.query(`
    SELECT
    *
    FROM
        users
    LEFT JOIN health_status ON health_status.uid = users.userid
    LEFT JOIN address ON address.id = users.userid
    LEFT JOIN enrolls_to on enrolls_to.uid = users.userid
    LEFT JOIN plan on plan.pid = enrolls_to.pid
    WHERE userid = ?;
    `, [req.params.id]);
    console.log(result)
    res.json(result);
  } catch (error) {
    console.error('Error fetching Member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment History
router.get('/paymentHistory/:id', async (req, res) => {
  try {
    // userid,username,gender,mobile,email,dob,joining_date,expire
    const [result] = await pool.query(`
    SELECT
    *
    FROM
        enrolls_to
    LEFT JOIN plan ON enrolls_to.pid = plan.pid
    WHERE
        enrolls_to.uid = ?;
    `, [req.params.id]);
    console.log(result)
    res.json(result);
  } catch (error) {
    console.error('Error fetching Member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Memo Data
router.get('/memo', async (req, res) => {
  try {
    // userid,username,gender,mobile,email,dob,joining_date,expire
    const {userId,et_id} = req.query;
    console.log({userId,et_id})
    const [result] = await pool.query(`
    SELECT * FROM users u 
    INNER JOIN enrolls_to e ON u.userid = e.uid 
    INNER JOIN plan p ON p.pid = e.pid 
    WHERE u.userid = ? AND e.et_id = ?
    `, [userId,et_id]);
    console.log(result)
    res.json(result);
  } catch (error) {
    console.error('Error fetching Memo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/update-Member/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const inputs = req.body

    console.log({inputs,id});

    //Update users
    const [result] = await UpdateUser(id,inputs.username,inputs.gender,inputs.mobile,inputs.email,inputs.dob,inputs.joining_date);
    console.log({result});
    console.log('Update user Passed')
    //Update address
    await UpdateAddress(id,inputs.streetName,inputs.state,inputs.city,inputs.zipcode)
    // console.log({resu})
    console.log('Update address Passed')
    //Update health Status
    await UpdateHealthStatus(id,inputs.calorie,inputs.height,inputs.weight,inputs.fat,inputs.remarks)
    // console.log( 'output: ',ouput)
    console.log('Update Health Passed');
    
    res.status(200).json({ message: 'Member Udpated successfully' });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/health-status', async (req, res) => {
  try {
    const [result] = await pool.query(`
    SELECT
    *
    FROM
        users
    INNER JOIN health_status ON health_status.uid = users.userid
    ORDER BY users.userid
    `,[]);
    console.log({result});
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching health-status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get Income Per Month
router.get('/income-per-month/:month?/:year?', async (req, res) => {
  try {
    const {month,year} = req.params;
    const [result] = await pool.query(`
      SELECT DISTINCT
            userid,username,gender,mobile,email,joining_date,state,
            city,paid_date,expire,planName,amount,validity
        FROM
            users
        INNER JOIN address ON address.id = users.userid
        INNER JOIN enrolls_to ON enrolls_to.uid = users.userid
        INNER JOIN plan ON plan.pid = enrolls_to.pid
        WHERE
            MONTH(enrolls_to.paid_date) = ? AND YEAR(enrolls_to.paid_date) = ?;
    `,[month,year]);
    console.log({result});
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching income-per-month:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});







module.exports = router;
