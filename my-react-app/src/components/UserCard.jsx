import PropTypes from 'prop-types';
import './UserCard.css';
import './AuditRatioChart.css';
import { useState,useEffect } from 'react';
import './UserList.css'
import Chart from 'react-apexcharts';
import './histogram.css';
let theusername;
const AuditRatioChart = ({ totalUp, totalDown }) => {
  // Calculate the total for scaling
  const total = totalUp + totalDown;
const ratio = totalUp / totalDown; // Ratio of totalUp to totalDown
  // Calculate the width of each rectangle based on their values
  const upWidth = (totalUp / total) * 100; // Percentage for totalUp
  const downWidth = (totalDown / total) * 100; // Percentage for totalDown

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3>Audit Ratio {ratio.toFixed(3)}</h3>
      <svg width="100%" height="50">
        <rect
          x="0"
          y="0"
          width={`${upWidth}%`}
          height="50"
          fill="#2196F3" // Blue color for totalUp
        />
        <rect
          x={`${upWidth}%`}
          y="0"
          width={`${downWidth}%`}
          height="50"
          fill="#BBDEFB" // Light blue color for totalDown
        />
      </svg>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <span>Total Up: {totalUp}</span>
        <span>Total Down: {totalDown}</span>
      </div> */}
    </div>
  );
};

// Add PropTypes validation for AuditRatioChart
AuditRatioChart.propTypes = {
  totalUp: PropTypes.number.isRequired,
  totalDown: PropTypes.number.isRequired,
};
const Histogram = ({ users }) => {
    // Prepare data for the histogram
    const levelCounts = {};
    const cohortCounts = { cohort1: {}, cohort2: {}, cohort3: {} };

    users.forEach(user => {
        const level = user.level;
        const cohort = getCohort(user.eventId); // Replace with your cohort determination logic

        // Count total users at each level
        if (!levelCounts[level]) {
            levelCounts[level] = 0;
        }
        levelCounts[level]++;

        // Count users by cohort at each level
        const cohortKey = `cohort${cohort.charAt(cohort.length - 1)}`;
        if (!cohortCounts[cohortKey][level]) {
            cohortCounts[cohortKey][level] = 0;
        }
        cohortCounts[cohortKey][level]++;
    });

    // Prepare the data series for the chart
    const levels = Object.keys(levelCounts).sort((a, b) => a - b);
    const dataCohort1 = levels.map(level => cohortCounts.cohort1[level] || 0);
    const dataCohort2 = levels.map(level => cohortCounts.cohort2[level] || 0);
    const dataCohort3 = levels.map(level => cohortCounts.cohort3[level] || 0);

    // Chart options
    const options = {
        chart: {
            type: 'bar',
            height: 500,
            stacked: true,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: 'rounded',
                columnWidth: '60%',
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#004f75', '#0074D9', '#ffffff'], // Colors for each cohort
        xaxis: {
            categories: levels,
            title: {
                text: 'User Levels'
            }
        },
        yaxis: {
            title: {
                text: 'Number of Users'
            },
            labels: {
                formatter: (val) => val.toString()
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
        series: [
            {
                name: 'Cohort 1',
                data: dataCohort1
            },
            {
                name: 'Cohort 2',
                data: dataCohort2
            },
            {
                name: 'Cohort 3',
                data: dataCohort3
            }
        ]
    };

    // Render the chart
    return (
        <div>
            <h2>User Level Distribution by Cohort</h2>
            <Chart options={options} series={options.series} type="bar" height={350} width={575}/>
        </div>
    );
};
Histogram.propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({
      level: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      userLogin: PropTypes.string.isRequired,
      eventId: PropTypes.number.isRequired,
    })).isRequired,
  };

  const RadarChart = ({ transactions }) => {
    // Filter transactions based on eventId and type
    const filteredTransactions = transactions.filter(transaction =>
        [20, 72, 250].includes(transaction.eventId) 
        // ['skill_stats', 'skill_prog', 'skill_docker', 'skill_back-end', 'skill_front-end', 'skill_algo', 'skill_tcp', 'skill_game', 'skill_sys-admin', 'skill_ai', 'skill_blockchain', 'skill_mobile', 'skill_cybersecurity'].includes(transaction.type)
    );

    // Initialize skill and technology data
    const skillData = {
        labels: [
            'Elementary Programming',   // index 0 (skill_prog)
            'Back-end Technologies',     // index 1 (skill_back-end)
            'Front-end Technologies',    // index 2 (skill_front-end)
            'Elementary Algorithms',      // index 3 (skill_algo)
            'TCP/IP',                    // index 4 (skill_tcp)
            'Statistics',                // index 5 (skill_stats)
            'Game Programming',          // index 6 (skill_game)
            'System Administration',      // index 7 (skill_sys-admin)
            'AI',                        // index 8 (skill_ai)
            'Blockchain',                // index 9 (skill_blockchain)
            'Mobile Development',         // index 10 (skill_mobile)
            'Cybersecurity'              // index 11 (skill_cybersecurity)
        ],
        values: Array(12).fill(0) // Initialize with zeros
    };

    const techData = {
        labels: [
            'Go',                        // index 0
            'JavaScript',                // index 1
            'HTML',                      // index 2
            'C',                         // index 3
            'SQL',                       // index 4
            'CSS',                       // index 5
            'Unix',                      // index 6
            'Docker',                    // index 7
            'Rust',                      // index 8
            'Shell',                     // index 9
            'PHP',                       // index 10
            'Python',                    // index 11
            'Ruby',                      // index 12
            'C++',                       // index 13
            'GraphQL',                  // index 14
            'Ruby on Rails',            // index 15
            'Laravel',                   // index 16
            'Django',                    // index 17
            'Electron',                  // index 18
            'Git'                        // index 19
        ],
        values: Array(20).fill(0) // Initialize with zeros
    };

    // Calculate values based on filtered transactions
    filteredTransactions.forEach(transaction => {
        const { type, amount } = transaction; // Extract type and amount

        // Update skillData values based on correct mapping
        if (type === 'skill_prog') skillData.values[0] = Math.max(skillData.values[0], amount); // Elementary Programming
        else if (type === 'skill_back-end') skillData.values[1] = Math.max(skillData.values[1], amount); // Back-end Technologies
        else if (type === 'skill_front-end') skillData.values[2] = Math.max(skillData.values[2], amount); // Front-end Technologies
        else if (type === 'skill_algo') skillData.values[3] = Math.max(skillData.values[3], amount); // Elementary Algorithms
        else if (type === 'skill_tcp') skillData.values[4] = Math.max(skillData.values[4], amount); // TCP/IP
        else if (type === 'skill_stats') skillData.values[5] = Math.max(skillData.values[5], amount); // Statistics
        else if (type === 'skill_game') skillData.values[6] = Math.max(skillData.values[6], amount); // Game Programming
        else if (type === 'skill_sys-admin') skillData.values[7] = Math.max(skillData.values[7], amount); // System Administration
        else if (type === 'skill_ai') skillData.values[8] = Math.max(skillData.values[8], amount); // AI
        else if (type === 'skill_blockchain') skillData.values[9] = Math.max(skillData.values[9], amount); // Blockchain
        else if (type === 'skill_mobile') skillData.values[10] = Math.max(skillData.values[10], amount); // Mobile Development
        else if (type === 'skill_cybersecurity') skillData.values[11] = Math.max(skillData.values[11], amount); // Cybersecurity
    });

    // Similarly calculate values for technologies
    filteredTransactions.forEach(transaction => {
        const { type, amount } = transaction; // Extract type and amount

        // Update techData values based on correct mapping
        if (type === 'skill_go') techData.values[0] = Math.max(techData.values[0], amount); // Go
        else if (type === 'skill_js') techData.values[1] = Math.max(techData.values[1], amount); // JavaScript
        else if (type === 'skill_html') techData.values[2] = Math.max(techData.values[2], amount); // HTML
        else if (type === 'skill_c') techData.values[3] = Math.max(techData.values[3], amount); // C
        else if (type === 'skill_sql') techData.values[4] = Math.max(techData.values[4], amount); // SQL
        else if (type === 'skill_css') techData.values[5] = Math.max(techData.values[5], amount); // CSS
        else if (type === 'skill_unix') techData.values[6] = Math.max(techData.values[6], amount); // Unix
        else if (type === 'skill_docker') techData.values[7] = Math.max(techData.values[7], amount); // Docker
        else if (type === 'skill_rust') techData.values[8] = Math.max(techData.values[8], amount); // Rust
        else if (type === 'skill_shell') techData.values[9] = Math.max(techData.values[9], amount); // Shell
        else if (type === 'skill_php') techData.values[10] = Math.max(techData.values[10], amount); // PHP
        else if (type === 'skill_python') techData.values[11] = Math.max(techData.values[11], amount); // Python
        else if (type === 'skill_ruby') techData.values[12] = Math.max(techData.values[12], amount); // Ruby
        else if (type === 'skill_cpp') techData.values[13] = Math.max(techData.values[13], amount); // C++
        else if (type === 'skill_graphql') techData.values[14] = Math.max(techData.values[14], amount); // GraphQL
        else if (type === 'skill_ruby_on_rails') techData.values[15] = Math.max(techData.values[15], amount); // Ruby on Rails
        else if (type === 'skill_laravel') techData.values[16] = Math.max(techData.values[16], amount); // Laravel
        else if (type === 'skill_django') techData.values[17] = Math.max(techData.values[17], amount); // Django
        else if (type === 'skill_electron') techData.values[18] = Math.max(techData.values[18], amount); // Electron
        else if (type === 'skill_git') techData.values[19] = Math.max(techData.values[19], amount); // Git
    });

    // Toggle state for radar chart
    const [isTech, setIsTech] = useState(true);

    // Chart options
    const options = {
        chart: {
            type: 'radar',
        },
        xaxis: {
            categories: isTech ? techData.labels : skillData.labels,
        },
        fill: {
            opacity: 0.6,
        },
        markers: {
            size: 4,
        },
    };

    return (
        <div>
            <h2>{isTech ? 'Technologies' : 'Technical Skills'}</h2>
            <button onClick={() => setIsTech(!isTech)}>
                Switch to {isTech ? 'Technical Skills' : 'Technologies'}
            </button>
            <Chart
                options={options}
                series={[{
                    name: isTech ? 'Technology Proficiency' : 'Skill Proficiency',
                    data: isTech ? techData.values : skillData.values
                }]}
                type="radar"
                width="691"
            />
        </div>
    );
};

RadarChart.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        amount: PropTypes.number.isRequired,
        path: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        userLogin: PropTypes.string.isRequired,
        eventId: PropTypes.number.isRequired,
    })).isRequired,
};

  const PieChart = ({ transactions }) => {
    // Filter transactions based on eventId and type
    const filteredTransactions = transactions.filter(transaction =>
        [20, 72, 250].includes(transaction.eventId) && transaction.type === "xp"
    );
    const getLastSegment = (path) => {
        const segments = path.split('/');
        return segments.pop(); // Retrieve the last segment of the array
    };
    // Prepare data for the pie chart
    const transactionData = {};
    filteredTransactions.forEach(transaction => {
        transactionData[getLastSegment(transaction.path)] = transaction.amount;
    });

    // Convert the transaction data into arrays for the chart
    const labels = Object.keys(transactionData);
    const amounts = Object.values(transactionData);
    const bluishColors = ['#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB'];
    // Chart options
    const options = {
        chart: {
            type: 'pie',
        },
        labels: labels,
        colors: bluishColors,
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <div>
            <h2>User XP Distribution</h2>
            <Chart options={options} series={amounts} type="pie" width="800" />
        </div>
    );
};

// Add PropTypes validation for PieChart
PieChart.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        amount: PropTypes.number.isRequired,
        path: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        userLogin: PropTypes.string.isRequired,
        eventId: PropTypes.number.isRequired,
    })).isRequired,
};
  
const getCohort = (eventId) => {
    if (eventId === 20) {
      return 'Cohort 1';
    } else if (eventId === 72) {
      return 'Cohort 2';
    } else {
      return 'Cohort 3'; // Default cohort
    }
  };
  
  const UserList = ({ users }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const usersPerPage = 5;
    let userpage= null;
    // Sort users by level in descending order
    const sortedUsers = [...users].sort((a, b) => b.level - a.level);

    // Calculate pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = (filteredUsers.length > 0 ? filteredUsers : sortedUsers).slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil((filteredUsers.length > 0 ? filteredUsers : sortedUsers).length / usersPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber>0)
        {setCurrentPage(pageNumber)};
    };

    const handleRankByCohort = (cohort) => {
        const cohortFilteredUsers = users.filter(user => getCohort(user.eventId) === cohort);
        // Sort filtered users by level in descending order
        const rankedUsers = cohortFilteredUsers.sort((a, b) => b.level - a.level);
        setFilteredUsers(rankedUsers);
        setCurrentPage(1); // Reset to the first page
    };

    sortedUsers.map((user, index) => {
        if (user.userLogin === theusername) {
            userpage = ((index/5)).toFixed(0);
        }});
        useEffect(()=>{
            handlePageChange(userpage);
        },[])
    return (
        <div className="user-list">
            <h2>Users Ranking!</h2>
            <ul>
                {currentUsers.map((user, index) => {
                    // Calculate the rank based on the position in the sorted list
                    const rank = index + 1 + indexOfFirstUser; // Add the offset for the current page
                    return (
                        <li key={user.userId}>
                            {rank}: Level:{user.level}, {user.userLogin}
                            {user.userLogin === theusername && '(You)'}
                            , {getCohort(user.eventId)}
                        </li>
                    );
                })}
            </ul>
            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button className = "c"onClick={() => handleRankByCohort('Cohort 1')}>C1</button>
            <button className = "c" onClick={() => handleRankByCohort('Cohort 2')}>C2</button>
            <button className = "c" onClick={() => handleRankByCohort('Cohort 3')}>C3</button>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({
        level: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired,
        userLogin: PropTypes.string.isRequired,
        eventId: PropTypes.number.isRequired,
    })).isRequired,
};

const UserCard = ({ data }) => {
    const user = data.user[0]; // Ensure data is defined and has user
    const transactions = data.transaction; 
    const all = data.event_user;

    let cohortVariable = null;
    theusername = user.login;
    let levell =null;
    all.forEach(u => {
        if (u.userLogin== theusername) {
            levell = u.level;
        }
    }); 
    // Determine the cohort based on transactions
    transactions.forEach(transaction => {
      if (transaction.path === "/bahrain/bh-module/go-reloaded") {
        // Set cohort based on eventId
        if (transaction.eventId === 20) {
          cohortVariable = 'Cohort 1';
        } else if (transaction.eventId === 72) {
          cohortVariable = 'Cohort 2';
        } else if (transaction.eventId === 250) {
          cohortVariable = 'Cohort 3';
        }
      }
    });
    const handleRefresh = () => {
        window.location.reload();
    };
    return (
        <div className="container">
        <div className="user-card">
            <h1>{user.firstName} {user.lastName}</h1>
            <h2>You are in <strong>{cohortVariable}</strong></h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.login}</p>
            <p><strong>Your Level:</strong> {levell}</p>
            <div className="audit-ratio-card"  style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <AuditRatioChart totalUp={user.totalUp} totalDown={user.totalDown} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>

            <button
                className="refresh-button"
                onClick={handleRefresh}
                style={{
                    marginTop: '20px',
                    backgroundColor: '#007bff', // Green color
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px 15px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background-color 0.3s',
                }}
            >
                Log Out
            </button>
            </div>
            </div>
            <UserList users={data.event_user} />
            <div className="hist">
            <Histogram users={data.event_user}/>
           </div>
           <div className='pie'>
           <PieChart transactions= {data.transaction}/>
           </div>
           <div className='radar'>
            <RadarChart transactions={data.transaction}/>
           </div>
        </div>
    );
};

UserCard.propTypes = {
    data: PropTypes.shape({
        user: PropTypes.arrayOf(PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            login: PropTypes.string.isRequired,
            auditRatio: PropTypes.number.isRequired,
            totalDown: PropTypes.number.isRequired,
            totalUp: PropTypes.number.isRequired,
        })).isRequired,
        event_user: PropTypes.arrayOf(PropTypes.shape({
            level: PropTypes.number.isRequired,
            userId: PropTypes.number.isRequired,
            userLogin: PropTypes.string.isRequired,
            eventId: PropTypes.number.isRequired,
        })).isRequired,
        transaction: PropTypes.arrayOf(PropTypes.shape({
            amount: PropTypes.number.isRequired,
            path: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            userLogin: PropTypes.string.isRequired,
            eventId: PropTypes.number.isRequired,
        })).isRequired,
    }).isRequired,
};

export default UserCard;