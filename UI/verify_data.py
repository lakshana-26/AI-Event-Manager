"""
Automated Verification Suite for AI-Event-Manager DATA/JSON Layer
Validates syntax, counts, schemas, ID uniqueness, and referential integrity across all JSON files.
"""

import json
import os
import sys

def run_tests():
    ui_dir = os.path.dirname(os.path.abspath(__file__))
    print("=" * 80)
    print("AI-EVENT-MANAGER DATA/JSON LAYER VERIFICATION")
    print(f"Target Directory: {ui_dir}")
    print("=" * 80)

    expected_files = [
        "users.json",
        "staff.json",
        "students.json",
        "events.json",
        "responses.json",
        "venues.json",
        "resources.json",
        "rules.json"
    ]

    all_passed = True
    test_results = []

    def record_test(test_name, passed, message=""):
        nonlocal all_passed
        if not passed:
            all_passed = False
        status = "[PASS]" if passed else "[FAIL]"
        test_results.append((status, test_name, message))
        msg_str = f" - {message}" if message else ""
        print(f"{status} {test_name}{msg_str}")

    # 1. File existence & JSON Syntax Check
    loaded_data = {}
    for filename in expected_files:
        filepath = os.path.join(ui_dir, filename)
        if not os.path.exists(filepath):
            record_test(f"File Existence: {filename}", False, "File does not exist")
            continue
        
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                loaded_data[filename] = data
                record_test(f"JSON Syntax: {filename}", True, f"Parsed valid JSON ({len(data)} items)")
        except Exception as e:
            record_test(f"JSON Syntax: {filename}", False, f"JSON decode error: {str(e)}")

    if len(loaded_data) != len(expected_files):
        print("\nAborting deep checks due to missing or invalid JSON files.")
        return False

    users = loaded_data["users.json"]
    staff = loaded_data["staff.json"]
    students = loaded_data["students.json"]
    events = loaded_data["events.json"]
    responses = loaded_data["responses.json"]
    venues = loaded_data["venues.json"]
    resources = loaded_data["resources.json"]
    rules = loaded_data["rules.json"]

    # 2. User Count Checks
    admin_count = sum(1 for u in users if u.get("role") == "admin")
    staff_count = sum(1 for u in users if u.get("role") == "staff")
    student_count = sum(1 for u in users if u.get("role") == "student")
    total_users = len(users)

    record_test("User Count: Admin == 1", admin_count == 1, f"Found {admin_count}")
    record_test("User Count: Staff == 15", staff_count == 15, f"Found {staff_count}")
    record_test("User Count: Students == 80", student_count == 80, f"Found {student_count}")
    record_test("User Count: Total == 96", total_users == 96, f"Found {total_users}")

    # 3. User ID & Registration ID Uniqueness
    user_ids = [u.get("user_id") for u in users]
    reg_ids = [u.get("registration_id") for u in users]

    record_test("User IDs Unique", len(user_ids) == len(set(user_ids)), f"{len(set(user_ids))} unique of {len(user_ids)}")
    record_test("Registration IDs Unique", len(reg_ids) == len(set(reg_ids)), f"{len(set(reg_ids))} unique of {len(reg_ids)}")

    # 4. Valid Roles & Field Completeness in users.json
    valid_roles = {"admin", "staff", "student"}
    all_roles_valid = all(u.get("role") in valid_roles for u in users)
    record_test("Valid User Roles (admin, staff, student)", all_roles_valid)

    user_required_fields = {"user_id", "registration_id", "name", "email", "password", "role", "department", "status", "created_at"}
    users_fields_valid = all(user_required_fields.issubset(u.keys()) for u in users)
    record_test("Users Required Fields Present", users_fields_valid)

    # 5. Staff Profile Consistency
    record_test("Staff Count in staff.json == 15", len(staff) == 15, f"Found {len(staff)}")
    staff_required_fields = {"user_id", "registration_id", "name", "email", "department", "designation", "specialization", "phone", "office_room"}
    staff_fields_valid = all(staff_required_fields.issubset(s.keys()) for s in staff)
    record_test("Staff Profile Required Fields Present", staff_fields_valid)

    users_map = {u["user_id"]: u for u in users}
    staff_match_users = True
    for s in staff:
        u = users_map.get(s["user_id"])
        if not u or u["role"] != "staff" or u["registration_id"] != s["registration_id"] or u["name"] != s["name"]:
            staff_match_users = False
            break
    record_test("Staff Profile Referential Integrity with users.json", staff_match_users)

    # 6. Student Profile Consistency
    record_test("Student Count in students.json == 80", len(students) == 80, f"Found {len(students)}")
    student_required_fields = {"user_id", "registration_id", "name", "email", "department", "year_of_study", "section", "phone", "club_memberships", "is_volunteer"}
    student_fields_valid = all(student_required_fields.issubset(st.keys()) for st in students)
    record_test("Student Profile Required Fields Present", student_fields_valid)

    student_match_users = True
    for st in students:
        u = users_map.get(st["user_id"])
        if not u or u["role"] != "student" or u["registration_id"] != st["registration_id"] or u["name"] != st["name"]:
            student_match_users = False
            break
    record_test("Student Profile Referential Integrity with users.json", student_match_users)

    # 7. Initial Empty State for Events and Responses
    record_test("events.json initially empty list []", isinstance(events, list) and len(events) == 0, f"Length: {len(events)}")
    record_test("responses.json initially empty list []", isinstance(responses, list) and len(responses) == 0, f"Length: {len(responses)}")

    # 8. Venues Dataset Checks
    venue_ids = [v.get("venue_id") for v in venues]
    record_test("Venues Count == 8", len(venues) == 8, f"Found {len(venues)}")
    record_test("Venue IDs Unique", len(venue_ids) == len(set(venue_ids)))
    venue_required_fields = {"venue_id", "venue_name", "capacity", "availability", "suitable_event_type", "location", "facilities"}
    venues_fields_valid = all(venue_required_fields.issubset(v.keys()) for v in venues)
    record_test("Venues Required Fields Present", venues_fields_valid)
    venues_data_valid = all(isinstance(v["capacity"], int) and v["capacity"] > 0 and isinstance(v["availability"], bool) and isinstance(v["suitable_event_type"], list) for v in venues)
    record_test("Venues Types & Positive Capacity Valid", venues_data_valid)

    # 9. Resources Dataset Checks
    resource_ids = [r.get("resource_id") for r in resources]
    record_test("Resources Count >= 10", len(resources) >= 10, f"Found {len(resources)}")
    record_test("Resource IDs Unique", len(resource_ids) == len(set(resource_ids)))
    resource_required_fields = {"resource_id", "resource_name", "available_quantity", "unit_cost", "availability", "category"}
    resources_fields_valid = all(resource_required_fields.issubset(r.keys()) for r in resources)
    record_test("Resources Required Fields Present", resources_fields_valid)
    resources_data_valid = all(isinstance(r["available_quantity"], int) and r["available_quantity"] >= 0 and isinstance(r["unit_cost"], (int, float)) and r["unit_cost"] >= 0 for r in resources)
    record_test("Resources Quantities and Unit Costs Non-Negative", resources_data_valid)

    # 10. Rules & RAG Dataset Checks
    rule_ids = [rl.get("rule_id") for rl in rules]
    record_test("Rules Count >= 10", len(rules) >= 10, f"Found {len(rules)}")
    record_test("Rule IDs Unique", len(rule_ids) == len(set(rule_ids)))
    rule_required_fields = {"rule_id", "category", "title", "description", "parameters", "enforcement_level", "rag_text"}
    rules_fields_valid = all(rule_required_fields.issubset(rl.keys()) for rl in rules)
    record_test("Rules Required Fields Present", rules_fields_valid)
    rag_ready = all(isinstance(rl["rag_text"], str) and len(rl["rag_text"].strip()) > 20 and isinstance(rl["parameters"], dict) for rl in rules)
    record_test("Rules RAG Text and Parameters Valid", rag_ready)

    print("=" * 80)
    if all_passed:
        print("RESULT: ALL 23 DATA INTEGRITY VERIFICATION TESTS PASSED SUCCESSFULLY!")
        print("=" * 80)
        return True
    else:
        print("RESULT: VERIFICATION FAILED! Review failing tests above.")
        print("=" * 80)
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
