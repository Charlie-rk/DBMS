from hospital_management.models.user import CustomUser
from hospital_management.models.doctor import DoctorProfile
def get_all_doctors_raw():
    """
    Retrieves all doctor records by joining the custom user table with the doctor profile table,
    using the model manager's .raw() method.
    The extra doctor profile fields are aliased so they can be accessed as extra attributes.
    """
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
            d.doc_no AS extra_doc_no,
            d.specialization AS extra_specialization,
            d.years_of_experience AS extra_years_of_experience
        FROM hospital_management_customuser u
        INNER JOIN hospital_management_doctorprofile d ON u.id = d.user_id
        WHERE u.role = %s
    """
    # The query returns CustomUser instances with extra attributes.
    return CustomUser.objects.raw(query, ['doctor'])
