using InterviewTestBasic.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace InterviewTestBasic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return employees;
        }

        [HttpPost]
        public void Post([FromBody] Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"INSERT INTO Employees(Name, Value) VALUES(@n, @v)";
                queryCmd.Parameters.AddWithValue("@n", employee.Name);
                queryCmd.Parameters.AddWithValue("@v", employee.Value);
                queryCmd.ExecuteNonQuery();
            }
        }

        [HttpPut]
        public void Put([FromBody] Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"UPDATE Employees SET Value=@v WHERE Name=@n";
                queryCmd.Parameters.AddWithValue("@n", employee.Name);
                queryCmd.Parameters.AddWithValue("@v", employee.Value);
                queryCmd.ExecuteNonQuery();
            }
        }
    }
}
