export default {
    adminDeleteModal: {
      close: "✕",
      title: "Delete Administrator",
      confirm: "Are you sure you want to delete administrator {name} (s: {s})?",
      cancel: "Cancel",
      delete: "Delete",
    },
    

    applicationsDistributePage: {
        title: "Applications",
        btnAllApplications: "All Applications",
        btnDistributeStudents: "Distribute Students",
        approvedRequests: {
          title: "Approved Applications",
          empty: "No applications",
        },
        search: {
          placeholder: "Search...",
        },
        filter: {
          label: "Filter",
          gender: {
            title: "By Gender",
            male: "Male",
            female: "Female",
          },
          roomStatus: {
            title: "Room Status",
            assigned: "Assigned",
            unassigned: "Unassigned",
          },
          reset: "Reset Filters",
        },
        studentCard: {
          test: "Test",
          gender: {
            M: "M",
            F: "F",
          },
          assignedIn: "Assigned: {dorm}, room {room}",
          assignedInNoDormName: "Assigned: room {room}",
          notAssigned: "Not assigned",
        },
        dorms: {
          loading: "Loading...",
          empty: "No dorms found",
        },
        floors: {
          empty: "No floors found",
          floor: "{floor} floor",
        },
        rooms: {
          empty: "No rooms found",
          capacity: "{capacity}-bed",
          freeSpots: "{count} free spots",
          noOccupants: "— No occupants",
        },
        bottomActions: {
          sendOrders: "Send Orders",
          distributeGroups: "Automatically distribute into groups",
        },
        icons: {
          alt: {
            refresh: "Refresh",
            search: "Search",
            filter: "Filter",
            delete: "Delete",
          },
        },
      },



      adminChatPage: {
        students: "Students",
        searchPlaceholder: "Search...",
        noChats: "No chats",
        chatWith: "Chat with student {s}",
        noMessages: "No messages",
        inputPlaceholder: "Type your message...",
        selectStudent: "Select a student to chat",
        icons: {
          alt: {
            search: "Search",
            send: "Send message",
          },
        },
      },




      adminCreateModal: {
        close: "✕",
        title: "Add Administrator",
        labels: {
          s: "ID (s):",
          first_name: "First Name:",
          last_name: "Last Name:",
          middle_name: "Middle Name:",
          email: "Email:",
          phone_number: "Phone Number:",
          birth_date: "Birth Date:",
          gender: "Gender:",
          role: "Role:",
          password: "Password:",
        },
        genderOptions: {
          "": "Select...",
          M: "Male",
          F: "Female",
        },
        roleOptions: {
          "": "Select role",
          SUPER: "Super Administrator",
          OP: "Operator",
          REQ: "Request Administrator",
          COM: "Commandant",
        },
        buttons: {
          cancel: "Cancel",
          save: "Add",
        },
        messages: {
          success: "Administrator added",
          error: "Error adding administrator",
        },
      },




      adminDormChatPage: {
        headerListTitle: "Dorm Chats",
        searchPlaceholder: "Search...",
        noChats: "No chats",
        chatHeaderDorm: "Chat: Dorm № {dormID}",
        chatHeaderFloor: "Chat: Floor {floor} (Dorm № {dormID})",
        noMessages: "No messages",
        inputPlaceholder: "Type your message...",
        selectChat: "Select a chat to start",
        roomLabel: "room",
        commandant: "commandant",
        floorLabel:"Floor",
        icons: {
          alt: {
            search: "Search",
            send: "Send message",
          },
        },
      },




      adminDormitoriesPage: {
        title: "Manage Dormitories",
        buttons: {
          add: "Add Dormitory",
        },
        messages: {
          loadError: "Error loading dormitories list",
          statsError: "Failed to load room statistics",
          deleteSuccess: "Dormitory deleted successfully",
          deleteError: "Error deleting dormitory",
        },
        table: {
          headers: {
            name: "Name",
            places: "Places",
            roomsFor2: "Rooms for 2",
            roomsFor3: "Rooms for 3",
            roomsFor4: "Rooms for 4",
            cost: "Cost",
            actions: "Actions",
          },
          empty: "No data to display.",
        },
        pagination: {
          prev: "<",
          next: ">",
        },
        modals: {
          add: "Add Dormitory",
          edit: "Edit Dormitory",
          view: "View Dormitory",
          delete: "Delete Dormitory",
        },
        icons: {
          alt: {
            view: "View",
            edit: "Edit",
            delete: "Delete",
          },
        },
      },




      adminDormitoryAddModal: {
        close: "✕",
        title: "Add Dormitory",
        labels: {
          name: "Name:",
          total_places: "Total places:",
          cost: "Cost:",
          address: "Address:",
          description: "Description:",
          images: "Select images:",
          roomsSection: "Rooms",
          photosSection: "Photos",
          room_number: "Room number:",
          room_capacity: "Capacity:",
          name_ru: "Name (Russian)",
          name_kk: "Name (Kazakh)",
          name_en: "Name (English)",
          description_ru: "Description (Russian)",
          description_kk: "Description (Kazakh)",
          description_en: "Description (English)",
        },
        placeholders: {
          room_number: "101, 102A, etc.",
          room_capacity: "2, 3 or 4",
        },
        buttons: {
          addRoom: "+ Add another room",
          save: "Save",
          cancel: "Cancel",
          removeFile: "Remove this file",
          removeRoom: "Remove this room",
        },
        messages: {
          fillDorm: "Please fill in all required dormitory fields.",
          fillRooms: "Each room must have a number and capacity.",
          success: "Dormitory, rooms and photos added successfully.",
          error: "Error adding dormitory/rooms/photos.",
        },
      },




      adminDormitoryDeleteModal: {
        close: "✕",
        title: "Delete Dormitory",
        confirm: "Are you sure you want to delete the dormitory “{name}”?",
        buttons: {
          cancel: "Cancel",
          delete: "Delete",
        },
      },





      adminDormitoryEditModal: {
        title: "Edit Dormitory",
        close: "✕",
        labels: {
          name_ru: "Name (Russian)",
          name_kk: "Name (Kazakh)",
          name_en: "Name (English)",
          address: "Address",
          total_places: "Total Places",
          cost: "Cost per Place (KZT)",
          description_ru: "Description (Russian)",
          description_kk: "Description (Kazakh)",
          description_en: "Description (English)",
          photosSection: "Photos",
          images: "Manage Images",
          roomsSection: "Rooms",
          room_number: "Room Number",
          room_capacity: "Capacity"
        },
        buttons: {
          save: "Save",
          cancel: "Cancel",
          addRoom: "Add Room",
          removeRoom: "Remove Room",
          removeFile: "Remove File"
        },
        messages: {
          loadError: "Failed to load dormitory data.",
          fillDorm: "Please fill in all required dormitory fields.",
          fillDescription: "Please provide descriptions in all languages.",
          fillRooms: "Please specify number and capacity for each room.",
          success: "Changes saved successfully.",
          error: "Error saving changes. Please try again."
        }
      },





      adminDormitoryViewModal: {
        close: "✕",
        title: "View Dormitory",
        errorLoad: "Error loading dormitory data.",
        labels: {
          name: "Name:",
          address: "Address:",
          description: "Description:",
          total_places: "Total places:",
          cost: "Cost:",
          imagesSection: "Photos",
        },
        buttons: {
          close: "Close",
        },
        imageAlt: "Photo {id}",
      },




      adminEditModal: {
        close: "✕",
        title: "Edit Administrator",
        labels: {
          s: "ID (s):",
          first_name: "First Name:",
          last_name: "Last Name:",
          middle_name: "Middle Name:",
          email: "Email:",
          phone_number: "Phone Number:",
          birth_date: "Birth Date:",
          gender: "Gender:",
          role: "Role:",
        },
        genderOptions: {
          "": "Select...",
          M: "Male",
          F: "Female",
        },
        roleOptions: {
          "": "Select role",
          SUPER: "Super Administrator",
          OP: "Operator",
          REQ: "Request Administrator",
        },
        buttons: {
          cancel: "Cancel",
          save: "Save",
        },
        messages: {
          success: "Changes saved",
          error: "Error saving changes",
        },
      },




      adminListPage: {
        title: "Administrators",
        buttons: {
          add: "Add Administrator",
        },
        searchPlaceholder: "Search...",
        table: {
          headers: {
            avatar: "Photo",
            s: "S",
            first_name: "First Name",
            last_name: "Last Name",
            middle_name: "Middle Name",
            role: "Role",
            actions: "Actions",
          },
          empty: "No data to display.",
        },
        pagination: {
          page: "{page}",
        },
        icons: {
          alt: {
            search: "Search",
            edit: "Edit",
            view: "View",
            delete: "Delete",
          },
        },
      },





      adminNotifications: {
        title: "Notifications from Students",
        errors: {
          unauthorized: "Not authorized as admin.",
          loadError: "Error loading notifications.",
        },
        empty: "No new notifications",
        buttons: {
          hide: "Hide",
        },
      },




      adminPanel: {
        header: {
          dormChats: "Dorm Chats",
          chats: "Chats",
        },
        title: "Admin Panel",
        cards: {
          students: {
            title: "Students",
            desc: "Registered students",
            btn: "Manage",
          },
          dormitories: {
            title: "Dormitories",
            desc: "Dorms in system",
            btn: "Manage",
          },
          applications: {
            title: "Applications",
            desc: "Applications pending",
            btn: "Manage",
          },
        },
        stats: {
          loading: "",
        },
      },




      adminSidebar: {
        menu: {
          dashboard: "Dashboard",
          students: "Students",
          dormitories: "Dormitories",
          applications: "Applications",
          admins: "Administrators",
          evidenceTypes: "Evidence Categories",
        },
      },







      adminStudentAddModal: {
        close: "✕",
        title: "Add Student",
        labels: {
          s: "ID (s):",
          first_name: "First Name:",
          last_name: "Last Name:",
          middle_name: "Middle Name:",
          email: "Email:",
          birth_date: "Birth Date:",
          phone_number: "Phone Number:",
          gender: "Gender:",
          course: "Course:",
          region: "Region:",
          password: "Password:",
        },
        genderOptions: {
          "": "Select...",
          M: "Male",
          F: "Female",
        },
        regionPlaceholder: "Select region",
        buttons: {
          save: "Add",
          cancel: "Cancel",
        },
      },





      adminStudentDeleteModal: {
        close: "✕",
        title: "Delete Student",
        confirm: "Are you sure you want to delete student “{last} {first}” (s: {s})?",
        buttons: {
          cancel: "Cancel",
          delete: "Delete",
        },
      },






      adminStudentEditModal: {
        close: "✕",
        title: "Edit Student",
        labels: {
          s: "S:",
          first_name: "First Name:",
          last_name: "Last Name:",
          middle_name: "Middle Name:",
          email: "Email:",
          phone_number: "Phone Number:",
          birth_date: "Birth Date:",
          course: "Course:",
          region: "Region:",
          gender: "Gender:",
        },
        genderOptions: {
          "": "Select",
          M: "M",
          F: "F",
        },
        regionPlaceholder: "Select region",
        buttons: {
          cancel: "Cancel",
          save: "Save",
        },
        messages: {
          saveSuccess: "Data saved successfully.",
          saveError: "An error occurred while saving.",
        },
      },






      adminStudentsPage: {
        title: "Manage Students",
        buttons: {
          add: "Add Student",
          import: "Import Excel",
          export: "Export Excel",
        },
        searchPlaceholder: "Search...",
        table: {
          headers: {
            avatar: "Photo",
            s: "S",
            first_name: "First Name",
            last_name: "Last Name",
            middle_name: "Middle Name",
            course: "Course",
            actions: "Actions",
          },
          empty: "No data to display.",
        },
        pagination: {
          prev: "<",
          next: ">",
          page: "{page}",
        },
        importModal: {
          title: "Import Data from Excel",
          promptDefault: "Upload an Excel file",
          promptSuccess: "File selected: {name}",
          checkbox: "Overwrite existing data",
          requirementsTitle: "File requirements",
          requirements:
            "File must be XLSX or XLS format\nFirst row — column headers\nRequired fields: Full Name, Gender, Course",
          templateLink: "Download file template",
          buttons: {
            cancel: "Cancel",
            save: "Save",
          },
        },
        messages: {
          loadError: "Error loading data",
          noFile: "Please select a file first",
          uploadSuccess: "Data uploaded and updated successfully",
          uploadError: "Error uploading file",
        },
        icons: {
          alt: {
            search: "Search",
            view: "View",
            edit: "Edit",
            delete: "Delete",
            importDefault: "Import Excel",
            importActive: "File selected",
          },
        },
      },





      adminStudentViewModal: {
        close: "✕",
        title: "View Student",
        labels: {
          s: "S:",
          first_name: "First Name:",
          last_name: "Last Name:",
          middle_name: "Middle Name:",
          email: "Email:",
          phone_number: "Phone Number:",
          birth_date: "Birth Date:",
          course: "Course:",
          region: "Region:",
          gender: "Gender:",
        },
        placeholder: "-",
        buttons: {
          close: "Close",
        },
      },




      adminViewModal: {
        close: "✕",
        title: "View Administrator",
        labels: {
          s: "ID (s):",
          first_name: "First Name:",
          last_name: "Last Name:",
          middle_name: "Middle Name:",
          email: "Email:",
          phone_number: "Phone Number:",
          birth_date: "Birth Date:",
          gender: "Gender:",
          role: "Role:",
        },
        genderMap: {
          M: "Male",
          F: "Female",
          "": "",
        },
        roleOptions: {
          SUPER: "Super Administrator",
          OP: "Operator",
          REQ: "Request Administrator",
          "": "",
        },
        buttons: {
          close: "Close",
        },
      },




      auditLog: {
        title: "Recent Actions",
        loading: "Loading...",
        error: "Failed to load audit logs",
        time: {
          justNow: "just now",
          minutesAgo: "{count} min ago",
          hoursAgo: "{count} h ago",
          // for dates fallback to toLocaleDateString
          dateOptions: { locale: "en-US" }
        },
        modelSeparator: "•",
      },





      evidenceEditPage: {
        loading: "Loading...",
        title: "Edit Evidence Category",
        fields: {
          name: "Name:",
          code: "Code:",
          data_type: "Data Type:",
          priority: "Priority:",
          auto_fill_field: "Auto-fill Field:",
          keywords: "Keywords:",
        },
        dataTypeOptions: {
          file: "File",
          numeric: "Numeric",
        },
        keywordsPlaceholder: "Select keywords…",
        buttons: {
          cancel: "Cancel",
          save: "Save",
        },
        messages: {
          loadError: "Failed to load category data.",
          saveSuccess: "Category saved successfully.",
          saveError: "Error saving category.",
          validation: {
            name: "{msg}",
            code: "{msg}",
            data_type: "{msg}",
            priority: "{msg}",
            auto_fill_field: "{msg}",
            keywords: "{msg}",
          },
        },
      },





      evidenceCategoriesPage: {
        title: "Evidence Categories",
        buttons: {
          keywords: "Keywords",
          add: "Add Category"
        },
        table: {
          headers: {
            id: "ID",
            name: "Name",
            code: "Code",
            data_type: "Type",
            priority: "Priority",
            auto_fill_field: "Auto-fill",
            keywords: "Keywords",
            actions: "Actions"
          },
          empty: "No data to display."
        },
        dataType: {
          file: "File",
          numeric: "Integer"
        },
        pagination: {
          prev: "<",
          next: ">",
          page: "{page}"
        },
        deleteModal: {
          title: "Confirm Deletion",
          confirm: "Are you sure you want to delete category “{name}”?",
          buttons: {
            cancel: "Cancel",
            delete: "Delete"
          }
        },
        viewModal: {
          title: "View Category",
          fields: {
            id: "ID:",
            name: "Name:",
            code: "Code:",
            data_type: "Type:",
            priority: "Priority:",
            auto_fill_field: "Auto-fill:",
            keywords: "Keywords:"
          },
          buttons: {
            close: "Close"
          }
        },
        editModal: {
          title: "Edit Category",
          fields: {
            name: "Name",
            code: "Code",
            data_type: "Type",
            priority: "Priority",
            auto_fill_field: "Auto-fill",
            keywords: "Keywords"
          },
          dataTypeOptions: {
            file: "File",
            numeric: "Integer"
          },
          buttons: {
            cancel: "Cancel",
            save: "Save"
          }
        },
        addModal: {
          title: "Add Category",
          fields: {
            name: "Name",
            code: "Code",
            data_type: "Type",
            priority: "Priority",
            auto_fill_field: "Auto-fill",
            keywords: "Keywords"
          },
          dataTypeOptions: {
            file: "File",
            numeric: "Integer"
          },
          buttons: {
            cancel: "Cancel",
            save: "Save"
          }
        }
      },





      evidenceKeywordsPage: {
        title: "Keywords",
        buttons: {
          add: "Add Keyword",
        },
        table: {
          headers: {
            id: "ID",
            keyword: "Keyword",
            actions: "Actions",
          },
          empty: "No data to display.",
        },
        pagination: {
          prev: "<",
          next: ">",
          page: "{page}",
        },
        addModal: {
          title: "Add Keyword",
          placeholder: "Enter keyword...",
          buttons: {
            cancel: "Cancel",
            save: "Add",
          },
        },
        viewModal: {
          title: "View Keyword",
          fields: {
            id: "ID:",
            keyword: "Keyword:",
          },
          buttons: {
            close: "Close",
          },
        },
        editModal: {
          title: "Edit Keyword",
          buttons: {
            cancel: "Cancel",
            save: "Save",
          },
        },
        deleteModal: {
          title: "Confirm Deletion",
          confirm: "Are you sure you want to delete keyword “{keyword}”?",
          buttons: {
            cancel: "Cancel",
            delete: "Delete",
          },
        },
      },





      adminApplicationsDistributePage: {
        title: "Distribute Students",
        tabs: {
          all: "All Applications",
          distribute: "Distribute Students",
          export: "Export Excel",
        },
        searchPlaceholder: "Search...",
        table: {
          headers: {
            id: "ID",
            student: "Student",
            score: "GPA/ENT",
            status: "Status",
            payment: "Payment",
            actions: "Actions",
          },
          empty: "No data to display.",
        },
        pagination: {
          prev: "<",
          next: ">",
        },
        bottomButtons: {
          autoSelect: "Automatic Selection",
          notify: "Notify Students",
          notifying: "Sending...",
        },
        confirmModal: {
          approve: {
            title: "Approve Application",
            question: "Are you sure you want to approve this application?",
          },
          reject: {
            title: "Reject Application",
            question: "Are you sure you want to reject this application?",
          },
          buttons: {
            cancel: "Cancel",
            confirm: "Next",
          },
        },
        detailsModal: {
          title: "Application ID: {id}",
          fields: {
            student: "Student",
            score: "GPA / ENT",
            payment: "Payment",
            evidences: "Evidences",
            dorm: "Dormitory",
            status: "Status",
          },
          evidenceActions: {
            view: "View",
            accept: "Accept Evidence",
            reject: "Reject Evidence",
          },
          buttons: {
            close: "Close",
            cancel: "Cancel",
          },
        },
        notificationModal: {
          title: "Information",
          buttons: {
            close: "Close",
          },
        },
      },



      syncChatsButton: {
        sync: "Synchronize Chats",
        syncing: "Synchronizing...",
        messageInitCleanup: "init_all: {initMsg}. cleanup: deleted {deleted} chats.",
        error: "Sync error: {error}",
      },




      footer: {
        contactsTitle: "Contacts",
        address: "55 Zhandosova St, Auezov District\nAlmaty, Kazakhstan, 050035",
        email: "dorm@narxoz.kz",
        phone: "+7 (747) 364 88 99",
        socialTitle: "Follow us",
      },





      navbar: {
        home: "Home",
        apply: "Apply",
        editApplication: "Edit Application",
        adminPanel: "Admin Panel",
        notifications: {
          studentTitle: "Notifications",
          adminTitle: "Notifications (Admin)",
          noNotifications: "No notifications"
        },
        profile: {
          profile: "Profile",
          logout: "Log out"
        },
        auth: {
          login: "Log in"
        },
        warning: {
          title: "Application editing disabled",
          message: "Application editing is currently disabled. Please contact administration.",
          ok: "OK"
        }
      },




      applicationStatus: {
        title: "Application Status",
        errorNoApplication: "You have not submitted a dorm application",
        statusApproved: "Application approved; please make payment and attach a screenshot.",
        uploadSectionTitle: "Upload payment screenshot",
        uploadButton: "Upload",
        selectFileError: "Please select a file to upload",
        uploadSuccess: "Screenshot uploaded successfully.",
        uploadError: "Error uploading file. Please try again.",
        editApplication: "Edit Application",
      },




      applicationPage: {
        title: "Dorm Application",
        description: "Fill out the form and provide required documents to apply for dorm housing",
        firstName: "First Name",
        lastName: "Last Name",
        course: "Course",
        birthDate: "Birth Date",
        gender: "Gender",
        parentPhone: "Parent's Phone",
        selectParentPhone: "Enter parent's phone number",
        priceRange: "Price Range",
        selectPrice: "Select a price",
        entResultLabel: {
          freshman: "ENT Score",
          other: "GPA"
        },
        entPlaceholder: "Will be filled automatically",
        entCertificate: "ENT Certificate (PDF)",
        uploadDocsBtn: "Upload Additional Docs",
        submitBtn: "Submit Application",
        modal: {
          title: "Upload Documents",
          helpFreshman: "Your ENT Certificate was already uploaded above. You may add other documents here.",
          helpOther: "If you have any documents (certificates, etc.), you may attach them here.",
          footer: "You can upload missing files later.",
          closeBtn: "Close"
        },
        fileInputReplace: "Replace",
        fileInputUpload: "Upload",
        fileInputIcon: "📄"
      },





      editApplicationPage: {
        title: "Edit Application",
        desc: "Make necessary changes and click “Save Changes”",
        labels: {
          firstName: "First Name",
          lastName: "Last Name",
          course: "Course",
          gender: "Gender",
          birthDate: "Birth Date",
          parentPhone: "Parent Phone",
          priceRange: "Price Range",
          entResult: {
            label: "ENT Score",
            placeholder: "Will be auto-filled upon upload"
          },
          gpa: "GPA",
          uploadEnt: "Upload ENT Certificate",
          editDocs: "Edit Documents",
          save: "Save Changes",
          filesInApp: "Files in Application:",
          close: "Close"
        },
        notes: {
          ent: "Upload a PDF of your ENT certificate to auto-fill the ENT Score field."
        }
      },





      testPage: {
        title: "Test",
        loading: "Loading questions",
        loadError: "Error loading questions",
        errorPrefix: "Error: {error}",
        thankYou: "Thank you! You will be redirected to your profile",
        questionNotFound: "Question not found",
        progress: "Question {current} of {total}",
        back: "Back",
        next: "Next",
        submitTest: "Submit Test",
        alertIncomplete: "Please answer all questions.",
        submitError: "Error submitting test"
      },




      loginPage: {
        altLeft: "Character on the left",
        title: "Login",
        subtitleLine1: "Enter your credentials to",
        subtitleLine2: "access the system",
        errorAuth: "Authentication error",
        labelLogin: "Login",
        placeholderLogin: "Enter your login or phone number",
        labelPassword: "Password",
        placeholderPassword: "Enter your password",
        togglePasswordAlt: "toggle password",
        loginButton: "Log In",
        altRight: "Character on the right",
      },





      dormDetail: {
        loading: "Loading...",
        errorLoad: "Error loading dormitory data.",
        notFound: "Dormitory not found.",
        defaultDescription:
          "A traditional corridor-style student dormitory located within close proximity to the main academic building of the university.",
        leftArrow: "<",
        rightArrow: ">",
        mainInfoTitle: "Main Information",
        amenitiesTitle: "Amenities",
        applyTitle: "Apply Now",
        applyButton: "Submit Application",
        mapLabel: "Map of {address}",
        addressMissing: "Address unavailable",
        phoneMissing: "+7 (747) 364 88 99",
        floors: "{count} floors",
        cost: "{cost} KZT",
        places: "{count} beds",
        amenities: {
          wifi: "Wi-Fi",
          canteen: "Canteen",
          library: "Library",
          gym: "Gym",
          laundry: "Laundry",
          cleaning: "Cleaning",
          security: "Security"
        }
      },





      webAssistant: {
        title: "Web Assistant",
        close: "×",
        closeTitle: "Close",
        emptyMessages: "No messages",
        placeholder: "Type your question...",
        send: "➤",
        operatorButton: "Request Operator",
        endButton: "End Chat",
        chatEnded: "Chat ended.",
        loadingError: "Error loading messages.",
        sendError: "Failed to send message.",
        requestOperatorError: "Failed to request operator.",
        endChatError: "Failed to end chat.",
        fallbackMessage:
          "Your question is complex! An operator will connect soon to help you.",
        operatorCalled: "Operator requested. Please wait..."
      },


      home: {
        bannerAlt: "Banner",
        dormSectionTitle: "Our Dormitories",
        defaultDormDescription: "A new-style dormitory with modern amenities.",
        iconBed: "{count}",
        iconCanteen: "Canteen",
        iconLaundry: "Laundry",
        moreButton: "More Info",
        faqTitle: "Frequently Asked Questions",
        faq: [
          {
            question: "What is included in the accommodation cost?",
            answer: "Lodging, utilities, kitchen and shower access."
          },
          {
            question: "How long can I stay in the student house?",
            answer: "For the entire period of study, subject to rules."
          },
          {
            question: "Who is eligible for a dormitory spot?",
            answer: "Students who applied and passed selection."
          },
          {
            question: "How does move-in work?",
            answer:
              "An order is issued and a rental agreement is signed. Registration is done through the dean’s office. Unauthorized move-in is prohibited."
          },
          {
            question: "How can I pay for accommodation?",
            answer:
              "Payments are made via the university payment system or bank."
          },
          {
            question: "What rules must I follow?",
            answer: "Quiet hours, cleanliness, respect for neighbors and property."
          },
          {
            question: "What happens if rules are broken?",
            answer: "Warning, fine, or eviction depending on severity."
          }
        ],
        downloadText: "Download Student Dormitory Regulations",
        downloadButton: "Download"
      },




      notifications: {
        title: "Notifications",
        enableSound: "Enable Sound",
        errorLoad: "Failed to load notifications",
        noNotifs: "No notifications",
        openChat: "Chat",
        hide: "Hide",
      },





      userDashboard: {
        profileTitle: "My Profile",
        loadingProfile: "Loading...",
        errorProfile: "Failed to load profile data",
        changePassword: "Change Password",
        statusTitle: "Application Status",
        noApplication:
          "It seems you haven't applied yet. You can apply ",
        here: "here",
        application: "Application – ",
        approvedPayment:
          "Your application is approved; please make the payment and upload the receipt.",
        payAndUpload: "Make payment and upload receipt",
        uploadScreenshot: "Upload Screenshot",
        editApplication: "Edit Application",
        loadingSettings: "Loading...",
        selectFilePrompt: "Please select a file to upload",
        uploadSuccess: "Screenshot uploaded successfully.",
        uploadError:
          "Error uploading file. Please try again.",
        avatarManageTitle: "Manage Avatar",
        deleteAvatar: "Delete Avatar",
        chooseNew: "Choose New",
        close: "✕",
        changePasswordTitle: "Change Password",
        oldPassword: "Old Password",
        newPassword: "New Password",
        confirmPassword: "Confirm New Password",
        passwordFillAll: "Please fill in all fields.",
        passwordMismatch: "Passwords do not match.",
        passwordSuccess: "Password changed successfully.",
        passwordError:
          "Error changing password. Please try again.",
        cancel: "Cancel",
        save: "Save",
        editDisabledTitle: "Editing Disabled",
        editDisabledDesc:
          "Editing applications is currently disabled. Please contact administration.",
        okay: "OK",
        excelModalTitle: "Upload Payment Receipt",
        fileNotChosen: "No file chosen",
        fileChosen: "File selected: {name}",
        chooseFile: "Choose File",
        requirementsTitle: "File Requirements",
        requirementsDesc: "File must be in PDF format",
        send: "Send"
      },





      studentDormChat: {
        chatsTitle: "Chats",
        sync: {
          syncing: "Syncing...",
          button: "Sync Chats",
          success:
            "Synchronization complete. init_all: {initMsg}. cleanup: deleted {count} chats.",
          error: "Sync error: {error}"
        },
        searchPlaceholder: "Search...",
        noChats: "No chats",
        selectChatPrompt: "Select a chat to start messaging",
        noMessages: "No messages",
        messagePlaceholder: "Type your message...",
        floorLabel: 'Floor',
        roomLabel: "room",
        commandant: "commandant",
      },

  };