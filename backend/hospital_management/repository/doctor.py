from django.db import connection

def get_all_doctors():
    """
    Retrieves all doctor records by joining the custom user table with the doctor profile table.
    Only users with role 'doctor' are returned.
    """
    with connection.cursor() as cursor:
        query = """
            SELECT 
                u.id,
                u.username,
                u.email,
                u.address,
                u.dob,
                u.salary,
                u.gender,
                u.contact_no,
                u.joining_date,
                u.role,
                d.doc_no,
                d.specialization,
                d.years_of_experience
            FROM hospital_management_customuser u
            INNER JOIN hospital_management_doctorprofile d ON u.id = d.user_id
            WHERE u.role = %s
        """
        cursor.execute(query, ['doctor'])
        columns = [col[0] for col in cursor.description]
        doctors = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return doctors
