export default {
    adminDeleteModal: {
      close: "✕",
      title: "Әкімшіні жою",
      confirm: "Сіз шынымен де әкімшіні {name} (s: {s}) жойғыңыз келе ме?",
      cancel: "Болдырмау",
      delete: "Жою",
    },
    

    applicationsDistributePage: {
        title: "Өтініштер",
        btnAllApplications: "Барлық өтініштер",
        btnDistributeStudents: "Студенттерді бөлу",
        approvedRequests: {
          title: "Бекітілген өтініштер",
          empty: "Өтініштер жоқ",
        },
        search: {
          placeholder: "Іздеу...",
        },
        filter: {
          label: "Сүзгі",
          gender: {
            title: "Жынысы бойынша",
            male: "Ер",
            female: "Әйел",
          },
          roomStatus: {
            title: "Бөлме статусы",
            assigned: "Бөлме тағайындалған",
            unassigned: "Бөлмесіз",
          },
          reset: "Сүзгілерді қалпына келтіру",
        },
        studentCard: {
          test: "Тест",
          gender: {
            M: "Ер",
            F: "Әй",
          },
          assignedIn: "{dorm}, {room} бөлмесінде орналасқан",
          assignedInNoDormName: "{room} бөлмесінде орналасқан",
          notAssigned: "Орнатылмаған",
        },
        dorms: {
          loading: "Жүктелуде...",
          empty: "Қонақүйлер табылмады",
        },
        floors: {
          empty: "Қабаттар табылмады",
          floor: "{floor}-қабат",
        },
        rooms: {
          empty: "Бөлмелер табылмады",
          capacity: "{capacity}-орынды",
          freeSpots: "{count} бос орын",
          noOccupants: "— Бос орын жоқ",
        },
        bottomActions: {
          sendOrders: "Тапсырмаларды жіберу",
          distributeGroups: "Топтық бөлу",
        },
        icons: {
          alt: {
            refresh: "Жаңарту",
            search: "Іздеу",
            filter: "Сүзгі",
            delete: "Жою",
          },
        },
      },


      adminChatPage: {
        students: "Стәденттер",
        searchPlaceholder: "Іздеу...",
        noChats: "Чаттар жоқ",
        chatWith: "Студент {s}",
        noMessages: "Хабар жоқ",
        inputPlaceholder: "Хабарды енгізіңіз...",
        selectStudent: "Әңгімелесу үшін студентті таңдаңыз",
        icons: {
          alt: {
            search: "Іздеу",
            send: "Хабар жіберу",
          },
        },
      },




      adminCreateModal: {
        close: "✕",
        title: "Әкімшіні қосу",
        labels: {
          s: "ID (s):",
          first_name: "Аты:",
          last_name: "Тегі:",
          middle_name: "Әкесінің аты:",
          email: "Электрондық пошта:",
          phone_number: "Телефон нөмірі:",
          birth_date: "Туған күні:",
          gender: "Жынысы:",
          role: "Лауазым:",
          password: "Құпия сөз:",
        },
        genderOptions: {
          "": "Таңдаңыз...",
          M: "Ер",
          F: "Әйел",
        },
        roleOptions: {
          "": "Лауазымды таңдаңыз",
          SUPER: "Бас әкімші",
          OP: "Оператор",
          REQ: "Өтініштер әкімшісі",
          COM: "Комендант",
        },
        buttons: {
          cancel: "Болдырмау",
          save: "Қосу",
        },
        messages: {
          success: "Әкімші қосылды",
          error: "Қосу кезінде қате пайда болды",
        },
      },




      adminDormChatPage: {
        headerListTitle: "Жатақхана чаты",
        searchPlaceholder: "Іздеу...",
        noChats: "Чаттар жоқ",
        chatHeaderDorm: "Чат: Жатақхана № {dormID}",
        chatHeaderFloor: "Чат: {floor}-қабат (жатақхана № {dormID})",
        noMessages: "Хабар жоқ",
        inputPlaceholder: "Хабарды енгізіңіз...",
        selectChat: "Чатты таңдаңыз",
        roomLabel: "бөлме",
        commandant: "комендант",
        floorLabel:"Қабат",
        icons: {
          alt: {
            search: "Іздеу",
            send: "Хабар жіберу",
          },
        },
      },




      adminDormitoriesPage: {
        title: "Жатақханаларды басқару",
        buttons: {
          add: "Жатақхана қосу",
        },
        messages: {
          loadError: "Жатақханалар тізімін жүктеу қателігі",
          statsError: "Бөлмелер статистикасын жүктеу мүмкін болмады",
          deleteSuccess: "Жатақхана сәтті өшірілді",
          deleteError: "Жатақхананы өшіру қателігі",
        },
        table: {
          headers: {
            name: "Атауы",
            places: "Орындар",
            roomsFor2: "2 орынды бөлмелер",
            roomsFor3: "3 орынды бөлмелер",
            roomsFor4: "4 орынды бөлмелер",
            cost: "Бағасы",
            actions: "Әрекеттер",
          },
          empty: "Көрсетілетін деректер жоқ.",
        },
        pagination: {
          prev: "<",
          next: ">",
        },
        modals: {
          add: "Жатақхана қосу",
          edit: "Жатақхананы өзгерту",
          view: "Жатақхананы көру",
          delete: "Жатақхананы өшіру",
        },
        icons: {
          alt: {
            view: "Көру",
            edit: "Өзгерту",
            delete: "Өшіру",
          },
        },
      },






      adminDormitoryAddModal: {
        close: "✕",
        title: "Жатақхана қосу",
        labels: {
          name: "Атауы:",
          total_places: "Орындардың саны:",
          cost: "Бағасы:",
          address: "Мекен-жайы:",
          description: "Сипаттамасы:",
          images: "Суреттерді таңдау:",
          roomsSection: "Бөлмелер",
          photosSection: "Суреттер",
          room_number: "Бөлме нөмірі:",
          room_capacity: "Құрамдылығы:",
          name_ru: "Атауы (орысша)",
          name_kk: "Атауы (қазақша)",
          name_en: "Атауы (ағылш.)",
          description_ru: "Сипаттамасы (орысша)",
          description_kk: "Сипаттамасы (қазақша)",
          description_en: "Сипаттамасы (English)",
        },
        placeholders: {
          room_number: "101, 102A және т.б.",
          room_capacity: "2, 3 немесе 4",
        },
        buttons: {
          addRoom: "+ Тағы бір бөлме қосу",
          save: "Сақтау",
          cancel: "Болдырмау",
          removeFile: "Бұл файлды өшіру",
          removeRoom: "Бұл бөлмені өшіру",
        },
        messages: {
          fillDorm: "Барлық міндетті жатақхана өрістерін толтырыңыз.",
          fillRooms: "Барлық бөлмелерде нөмірі мен сыйымдылығы болуы керек.",
          success: "Жатақхана, бөлмелер және суреттер сәтті қосылды.",
          error: "Жатақхана/бөлмелер/суреттерді қосу барысында қате пайда болды.",
        },
      },



      adminDormitoryDeleteModal: {
        close: "✕",
        title: "Жатақхананы жою",
        confirm: "Сіз шынымен де «{name}» жатақханасын жойғыңыз келе ме?",
        buttons: {
          cancel: "Болдырмау",
          delete: "Жою",
        },
      },






      adminDormitoryEditModal: {
        title: "Жатақхананы өңдеу",
        close: "✕",
        labels: {
          name_ru: "Атауы (орысша)",
          name_kk: "Атауы (қазақша)",
          name_en: "Атауы (ағылш.)",
          address: "Мекенжай",
          total_places: "Орындар саны",
          cost: "Бағасы (тг)",
          description_ru: "Сипаттамасы (орысша)",
          description_kk: "Сипаттамасы (қазақша)",
          description_en: "Сипаттамасы (English)",
          photosSection: "Суреттер",
          images: "Суреттерді басқару",
          roomsSection: "Бөлмелер",
          room_number: "Бөлме нөмірі",
          room_capacity: "Көлемі"
        },
        buttons: {
          save: "Сақтау",
          cancel: "Болдырмау",
          addRoom: "Бөлме қосу",
          removeRoom: "Бөлмені жою",
          removeFile: "Файлды жою"
        },
        messages: {
          loadError: "Жатақхана деректерін жүктеу мүмкін болмады.",
          fillDorm: "Барлық жатақхана өрістерін толтырыңыз.",
          fillDescription: "Барлық тілдердегі сипаттамаларды толтырыңыз.",
          fillRooms: "Әр бөлменің нөмірі мен көлемін көрсетіңіз.",
          success: "Өзгерістер сәтті сақталды.",
          error: "Өзгерістерді сақтау кезінде қате. Қайта көріңіз."
        }
      },




      adminDormitoryViewModal: {
        close: "✕",
        title: "Жатақхананы көру",
        errorLoad: "Жатақхана мәліметтерін жүктеу қатесі.",
        labels: {
          name: "Атауы:",
          address: "Мекен-жайы:",
          description: "Сипаттамасы:",
          total_places: "Барлық орындар:",
          cost: "Бағасы:",
          imagesSection: "Суреттер",
        },
        buttons: {
          close: "Жабу",
        },
        imageAlt: "Фото {id}",
      },




      adminEditModal: {
        close: "✕",
        title: "Әкімшіні өңдеу",
        labels: {
          s: "ID (s):",
          first_name: "Аты:",
          last_name: "Тегі:",
          middle_name: "Әкесінің аты:",
          email: "Электрондық пошта:",
          phone_number: "Телефон нөмірі:",
          birth_date: "Туған күні:",
          gender: "Жынысы:",
          role: "Лауазым:",
        },
        genderOptions: {
          "": "Таңдаңыз...",
          M: "Ер",
          F: "Әйел",
        },
        roleOptions: {
          "": "Лауазымды таңдаңыз",
          SUPER: "Бас әкімші",
          OP: "Оператор",
          REQ: "Өтініштер әкімшісі",
        },
        buttons: {
          cancel: "Болдырмау",
          save: "Сақтау",
        },
        messages: {
          success: "Өзгерістер сақталды",
          error: "Сақтау қатесі",
        },
      },




      adminListPage: {
        title: "Әкімшілер",
        buttons: {
          add: "Әкімші қосу",
        },
        searchPlaceholder: "Іздеу...",
        table: {
          headers: {
            avatar: "Сурет",
            s: "S",
            first_name: "Аты",
            last_name: "Тегі",
            middle_name: "Әкесінің аты",
            role: "Лауазым",
            actions: "Әрекеттер",
          },
          empty: "Көрсетілетін деректер жоқ.",
        },
        pagination: {
          page: "{page}",
        },
        icons: {
          alt: {
            search: "Іздеу",
            edit: "Өңдеу",
            view: "Көру",
            delete: "Өшіру",
          },
        },
      },





      adminNotifications: {
        title: "Студенттердің хабарландырулары",
        errors: {
          unauthorized: "Әкімші ретінде авторизацияланбағансыз.",
          loadError: "Хабарландыруларды жүктеу қатесі.",
        },
        empty: "Жаңа хабарландырулар жоқ",
        buttons: {
          hide: "Жасыру",
        },
      },



      adminPanel: {
        header: {
          dormChats: "Жатақхана чаты",
          chats: "Чаттар",
        },
        title: "Әкімші панелі",
        cards: {
          students: {
            title: "Студенттер",
            desc: "Тіркелген студенттер",
            btn: "Басқару",
          },
          dormitories: {
            title: "Жатақханалар",
            desc: "Жүйедегі жатақханалар",
            btn: "Басқару",
          },
          applications: {
            title: "Өтініштер",
            desc: "Қаралатын өтініштер",
            btn: "Басқару",
          },
        },
        stats: {
          loading: "",
        },
      },





      adminStudentsPage: {
        title: "Студенттерді басқару",
        buttons: {
          add: "Студент қосу",
          import: "Excel импорттау",
          export: "Excel экспорттау",
        },
        searchPlaceholder: "Іздеу...",
        table: {
          headers: {
            avatar: "Сурет",
            s: "S",
            first_name: "Аты",
            last_name: "Тегі",
            middle_name: "Әкесінің аты",
            course: "Курс",
            actions: "Әрекеттер",
          },
          empty: "Көрсетілетін деректер жоқ.",
        },
        pagination: {
          page: "{page}",
        },
        importModal: {
          title: "Excel деректерін импорттау",
          promptDefault: "Excel файлын жүктеңіз",
          promptSuccess: "Файл таңдалды: {name}",
          checkbox: "Бар деректерді жаңарту",
          requirementsTitle: "Файл талаптары",
          requirements:
            "Файл XLSX немесе XLS форматында болуы керек\nАлғашқы жол — баған тақырыптары\nМіндетті өрістер: Аты-жөні, Жынысы, Курс",
          templateLink: "Үлгі файлын жүктеу",
          buttons: {
            cancel: "Болдырмау",
            save: "Сақтау",
          },
        },
        messages: {
          loadError: "Деректерді жүктеу қатесі",
          noFile: "Жүктеу үшін файл таңдаңыз",
          uploadSuccess: "Деректер сәтті жүктеліп, жаңартылды",
          uploadError: "Файлды жүктеу қатесі",
        },
        icons: {
          alt: {
            search: "Іздеу",
            view: "Көру",
            edit: "Өңдеу",
            delete: "Өшіру",
            importDefault: "Excel импорттау",
            importActive: "Файл таңдалды",
          },
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
          noFile: "Please select a file to upload",
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




      adminSidebar: {
        menu: {
          dashboard: "Панель",
          students: "Студенттер",
          dormitories: "Жатақханалар",
          applications: "Өтініштер",
          admins: "Әкімшілер",
          evidenceTypes: "Справка түрлері",
        },
      },





      adminStudentAddModal: {
        close: "✕",
        title: "Студент қосу",
        labels: {
          s: "ID (s):",
          first_name: "Аты:",
          last_name: "Тегі:",
          middle_name: "Әкесінің аты:",
          email: "Email:",
          birth_date: "Туған күні:",
          phone_number: "Телефон:",
          gender: "Жынысы:",
          course: "Курс:",
          region: "Облыс:",
          password: "Құпия сөз:",
        },
        genderOptions: {
          "": "Таңдаңыз...",
          M: "Ер",
          F: "Әйел",
        },
        regionPlaceholder: "Регионды таңдаңыз",
        buttons: {
          save: "Қосу",
          cancel: "Болдырмау",
        },
      },





      adminStudentDeleteModal: {
        close: "✕",
        title: "Студентті жою",
        confirm: "Сіз расында да «{last} {first}» (s: {s}) студентін жойғыңыз келе ме?",
        buttons: {
          cancel: "Болдырмау",
          delete: "Жою",
        },
      },
      




      adminStudentEditModal: {
        close: "✕",
        title: "Студентті өңдеу",
        labels: {
          s: "S:",
          first_name: "Аты:",
          last_name: "Тегі:",
          middle_name: "Әкесінің аты:",
          email: "Email:",
          phone_number: "Телефон:",
          birth_date: "Туған күні:",
          course: "Курс:",
          region: "Облыс:",
          gender: "Жынысы:",
        },
        genderOptions: {
          "": "Таңдаңыз",
          M: "Ер",
          F: "Әй",
        },
        regionPlaceholder: "Регионды таңдаңыз",
        buttons: {
          cancel: "Болдырмау",
          save: "Сақтау",
        },
        messages: {
          saveSuccess: "Деректер сәтті сақталды.",
          saveError: "Сақтау кезінде қате пайда болды.",
        },
      },





      adminStudentsPage: {
        title: "Студенттерді басқару",
        buttons: {
          add: "Студент қосу",
          import: "Excel импорттау",
          export: "Excel экспорттау",
        },
        searchPlaceholder: "Іздеу...",
        table: {
          headers: {
            avatar: "Сурет",
            s: "S",
            first_name: "Аты",
            last_name: "Тегі",
            middle_name: "Әкесінің аты",
            course: "Курс",
            actions: "Әрекеттер",
          },
          empty: "Көрсетілетін деректер жоқ.",
        },
        pagination: {
          prev: "<",
          next: ">",
          page: "{page}",
        },
        importModal: {
          title: "Excel деректерін импорттау",
          promptDefault: "Excel файлын жүктеңіз",
          promptSuccess: "Файл таңдалды: {name}",
          checkbox: "Бар деректерді жаңарту",
          requirementsTitle: "Файл талаптары",
          requirements:
            "Файл XLSX немесе XLS форматында болуы керек\nАлғашқы жол — баған тақырыптары\nМіндетті өрістер: ФИО, Жыныс, Курс",
          templateLink: "Үлгі файлын жүктеу",
          buttons: {
            cancel: "Болдырмау",
            save: "Сақтау",
          },
        },
        messages: {
          loadError: "Деректерді жүктеу қатесі",
          noFile: "Алдымен файл таңдаңыз",
          uploadSuccess: "Деректер сәтті жүктеліп, жаңартылды",
          uploadError: "Файлды жүктеу қатесі",
        },
        icons: {
          alt: {
            search: "Іздеу",
            view: "Көру",
            edit: "Өңдеу",
            delete: "Өшіру",
            importDefault: "Excel импорттау",
            importActive: "Файл таңдалды",
          },
        },
      },





      adminStudentViewModal: {
        close: "✕",
        title: "Студентті қарау",
        labels: {
          s: "S:",
          first_name: "Аты:",
          last_name: "Тегі:",
          middle_name: "Әкесінің аты:",
          email: "Email:",
          phone_number: "Телефон:",
          birth_date: "Туған күні:",
          course: "Курс:",
          region: "Облыс:",
          gender: "Жынысы:",
        },
        placeholder: "-",
        buttons: {
          close: "Жабу",
        },
      },





      adminViewModal: {
        close: "✕",
        title: "Әкімшіні қарау",
        labels: {
          s: "ID (s):",
          first_name: "Аты:",
          last_name: "Тегі:",
          middle_name: "Әкесінің аты:",
          email: "Пошта:",
          phone_number: "Телефон нөмірі:",
          birth_date: "Туған күні:",
          gender: "Жынысы:",
          role: "Лауазым:",
        },
        genderMap: {
          M: "Ер",
          F: "Жі",
          "": "",
        },
        roleOptions: {
          SUPER: "Бас әкімші",
          OP: "Оператор",
          REQ: "Өтініш әкімшісі",
          "": "",
        },
        buttons: {
          close: "Жабу",
        },
      },




      auditLog: {
        title: "Соңғы әрекеттер",
        loading: "Жүктелуде...",
        error: "Аудит журналын жүктеу мүмкін болмады",
        time: {
          justNow: "қазір",
          minutesAgo: "{count} мин бұрын",
          hoursAgo: "{count} сағ бұрын",
          dateOptions: { locale: "kk-KZ" }
        },
        modelSeparator: "•",
      },




      evidenceEditPage: {
        loading: "Жүктелуде...",
        title: "Справка санатын өңдеу",
        fields: {
          name: "Атауы:",
          code: "Код:",
          data_type: "Деректер түрі:",
          priority: "Приоритет:",
          auto_fill_field: "Өзін-өзі толтыру:",
          keywords: "Кілт сөздер:",
        },
        dataTypeOptions: {
          file: "Файл",
          numeric: "Сан",
        },
        keywordsPlaceholder: "Кілт сөздерді таңдаңыз…",
        buttons: {
          cancel: "Болдырмау",
          save: "Сақтау",
        },
        messages: {
          loadError: "Санат деректерін жүктеу мүмкін болмады.",
          saveSuccess: "Санат сәтті сақталды.",
          saveError: "Санатты сақтау кезінде қате пайда болды.",
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
        title: "Справка категориялары",
        buttons: {
          keywords: "Кілт сөздер",
          add: "Категория қосу"
        },
        table: {
          headers: {
            id: "ID",
            name: "Атауы",
            code: "Код",
            data_type: "Түрі",
            priority: "Приоритет",
            auto_fill_field: "Өзін-өзі толтыру",
            keywords: "Кілт сөздер",
            actions: "Әрекеттер"
          },
          empty: "Көрсетілетін деректер жоқ."
        },
        dataType: {
          file: "Файл",
          numeric: "Integer"
        },
        pagination: {
          prev: "<",
          next: ">",
          page: "{page}"
        },
        deleteModal: {
          title: "Жоюды растау",
          confirm: "«{name}» категориясын жойғыңыз келе ме?",
          buttons: {
            cancel: "Болдырмау",
            delete: "Жою"
          }
        },
        viewModal: {
          title: "Категорияны қарау",
          fields: {
            id: "ID:",
            name: "Атауы:",
            code: "Код:",
            data_type: "Түрі:",
            priority: "Приоритет:",
            auto_fill_field: "Өзін-өзі толтыру:",
            keywords: "Кілт сөздер:"
          },
          buttons: {
            close: "Жабу"
          }
        },
        editModal: {
          title: "Категорияны өңдеу",
          fields: {
            name: "Атауы",
            code: "Код",
            data_type: "Түрі",
            priority: "Приоритет",
            auto_fill_field: "Өзін-өзі толтыру",
            keywords: "Кілт сөздер"
          },
          dataTypeOptions: {
            file: "Файл",
            numeric: "Integer"
          },
          buttons: {
            cancel: "Болдырмау",
            save: "Сақтау"
          }
        },
        addModal: {
          title: "Категория қосу",
          fields: {
            name: "Атауы",
            code: "Код",
            data_type: "Түрі",
            priority: "Приоритет",
            auto_fill_field: "Өзін-өзі толтыру",
            keywords: "Кілт сөздер"
          },
          dataTypeOptions: {
            file: "Файл",
            numeric: "Integer"
          },
          buttons: {
            cancel: "Болдырмау",
            save: "Сақтау"
          }
        }
      },





      evidenceKeywordsPage: {
        title: "Кілт сөздер",
        buttons: {
          add: "Кілт сөз қосу",
        },
        table: {
          headers: {
            id: "ID",
            keyword: "Кілт сөз",
            actions: "Әрекеттер",
          },
          empty: "Көрсетілетін деректер жоқ.",
        },
        pagination: {
          prev: "<",
          next: ">",
          page: "{page}",
        },
        addModal: {
          title: "Кілт сөз қосу",
          placeholder: "Кілт сөзді енгізіңіз...",
          buttons: {
            cancel: "Болдырмау",
            save: "Қосу",
          },
        },
        viewModal: {
          title: "Кілт сөзді қарау",
          fields: {
            id: "ID:",
            keyword: "Кілт сөз:",
          },
          buttons: {
            close: "Жабу",
          },
        },
        editModal: {
          title: "Кілт сөзді өңдеу",
          buttons: {
            cancel: "Болдырмау",
            save: "Сақтау",
          },
        },
        deleteModal: {
          title: "Жоюды растау",
          confirm: "«{keyword}» кілт сөзін жойғыңыз келе ме?",
          buttons: {
            cancel: "Болдырмау",
            delete: "Жою",
          },
        },
      },





      adminApplicationsDistributePage: {
        title: "Студенттерді бөлу",
        tabs: {
          all: "Барлық өтініштер",
          distribute: "Оқушыларды бөлу",
          export: "Excel шығару",
        },
        searchPlaceholder: "Іздеу...",
        table: {
          headers: {
            id: "ID",
            student: "Студент",
            score: "GPA/ЕНТ",
            status: "Күйі",
            payment: "Төлем",
            actions: "Әрекеттер",
          },
          empty: "Көрсетілетін мәлімет жоқ.",
        },
        pagination: {
          prev: "<",
          next: ">",
        },
        bottomButtons: {
          autoSelect: "Автоматты бөлу",
          notify: "Оқушыларға хабарландыру",
          notifying: "Жіберілуде...",
        },
        confirmModal: {
          approve: {
            title: "Өтінішті мақұлдау",
            question: "Өтінішті мақұлдағыңыз келе ме?",
          },
          reject: {
            title: "Өтінішті кері қайтару",
            question: "Өтінішті кері қайтарғыңыз келе ме?",
          },
          buttons: {
            cancel: "Болдырмау",
            confirm: "Әрі қарай",
          },
        },
        detailsModal: {
          title: "Өтініш ID: {id}",
          fields: {
            student: "Студент",
            score: "GPA / ЕНТ",
            payment: "Төлем",
            evidences: "Соттама",
            dorm: "Жатақхана",
            status: "Күйі",
          },
          evidenceActions: {
            view: "Көру",
            accept: "Соттаманы қабылдау",
            reject: "Соттаманы қабылдамау",
          },
          buttons: {
            close: "Жабу",
            cancel: "Болдырмау",
          },
        },
        notificationModal: {
          title: "Ақпарат",
          buttons: {
            close: "Жабу",
          },
        },
      },



      syncChatsButton: {
        sync: "Чаттарды синхрондау",
        syncing: "Синхрондалуда...",
        messageInitCleanup: "init_all: {initMsg}. cleanup: {deleted} чат жойылды.",
        error: "Синхрондау қатесі: {error}",
      },



      footer: {
        contactsTitle: "Байланыстар",
        address: "Жандосова к-сі 55, Ауэзов ауданы\nАлматы, Қазақстан, 050035",
        email: "dorm@narxoz.kz",
        phone: "+7 (747) 364 88 99",
        socialTitle: "Біз әлеуметтік желілерде",
      },





      navbar: {
        home: "Басты бет",
        apply: "Өтінім беру",
        editApplication: "Өтінімді өңдеу",
        adminPanel: "Әкімшілік панелі",
        notifications: {
          studentTitle: "Хабарламалар",
          adminTitle: "Хабарламалар (Әкім)",
          noNotifications: "Хабарлама жоқ"
        },
        profile: {
          profile: "Профиль",
          logout: "Шығу"
        },
        auth: {
          login: "Кіру"
        },
        warning: {
          title: "Өтінімдерді өңдеу өшірілген",
          message: "Қазіргі уақытта өтінімдерді өңдеу мүмкін емес. Әкімшілікпен хабарласыңыз.",
          ok: "Түсінікті"
        }
      },




      applicationStatus: {
        title: "Өтініш мәртебесі",
        errorNoApplication: "Сіз студенттік үйге өтініш жібермедіңіз",
        statusApproved: "Өтініш мақұлданды, төлем жасаңыз және скрин тіркеңіз.",
        uploadSectionTitle: "Төлем скриншотын жүктеңіз",
        uploadButton: "Жүктеу",
        selectFileError: "Өтінеміз, жүктеу үшін файл таңдаңыз",
        uploadSuccess: "Скриншот сәтті жүктелді.",
        uploadError: "Файлды жүктеу қатесі. Қайта көріңізші.",
        editApplication: "Өтінішті өңдеу",
      },



      applicationPage: {
        title: "Тұрғын үйге өтініш",
        description: "Өтініш беру үшін қажетті құжаттарды толтырып жіберіңіз",
        firstName: "Аты",
        lastName: "Тегі",
        course: "Курс",
        birthDate: "Туған күні",
        gender: "Жынысы",
        parentPhone: "Ата-ана телефоны",
        selectParentPhone: "Ата-ана телефон нөмірін енгізіңіз",
        priceRange: "Баға диапазоны",
        selectPrice: "Бағаны таңдаңыз",
        entResultLabel: {
          freshman: "ЕНТ баллы",
          other: "GPA"
        },
        entPlaceholder: "Автоматты толтырылады",
        entCertificate: "ЕНТ сертификаты (PDF)",
        uploadDocsBtn: "Қосымша құжаттар жүктеу",
        submitBtn: "Өтініш жіберу",
        modal: {
          title: "Құжаттарды жүктеу",
          helpFreshman: "«ЕНТ сертификаты» жоғарыда жүктелді. Басқа құжаттарды қоса аласыз.",
          helpOther: "Қосымша құжаттарыңыз болса, осында жүктей аласыз.",
          footer: "Жетпейтін файлдарды кейін де тіркей аласыз.",
          closeBtn: "Жабу"
        },
        fileInputReplace: "Ауыстыру",
        fileInputUpload: "Жүктеу",
        fileInputIcon: "📄"
      },




      editApplicationPage: {
        title: "Өтінішті өңдеу",
        desc: "Қажетті өзгертулер енгізіп, «Өзгертулерді сақтау» түймесін басыңыз",
        labels: {
          firstName: "Аты",
          lastName: "Тегі",
          course: "Курс",
          gender: "Жынысы",
          birthDate: "Туған күні",
          parentPhone: "Ата-ана телефоны",
          priceRange: "Бағалар диапазоны",
          entResult: {
            label: "ЕНТ баллы",
            placeholder: "Сертификат жүктелгенде толытылады"
          },
          gpa: "GPA",
          uploadEnt: "ЕНТ сертификатын жүктеу",
          editDocs: "Құжаттарды өзгерту",
          save: "Өзгерістерді сақтау",
          filesInApp: "Өтініштегі файлдар:",
          close: "Жабу"
        },
        notes: {
          ent: "«ЕНТ баллы» автоматты түрде толтырылуы үшін PDF сертификатты жүктеңіз."
        }
      },



      testPage: {
        title: "Тест",
        loading: "Сұрақтар жүктелуде",
        loadError: "Сұрақтарды жүктеу қатесі",
        errorPrefix: "Қате: {error}",
        thankYou: "Рақмет! Профиль бетке қайта бағытталасыз",
        questionNotFound: "Сұрақ табылмады",
        progress: "{current} сұрақтың {total}-і",
        back: "Артқа",
        next: "Келесі",
        submitTest: "Тесті жіберу",
        alertIncomplete: "Барлық сұрақтарға жауап беріңіз.",
        submitError: "Тесті жіберу қатесі"
      },




      loginPage: {
        altLeft: "Сол жақтағы кейіпкер",
        title: "Жүйеге кіру",
        subtitleLine1: "Жүйеге кіре алу үшін өз",
        subtitleLine2: "есеп деректеріңізді енгізіңіз",
        errorAuth: "Кіру кезінде қате",
        labelLogin: "Логин",
        placeholderLogin: "Логинді немесе телефон нөмірін енгізіңіз",
        labelPassword: "Құпия сөз",
        placeholderPassword: "Құпия сөзіңізді енгізіңіз",
        togglePasswordAlt: "парольді көрсету/жасыру",
        loginButton: "Кіру",
        altRight: "Оң жақтағы кейіпкер",
      },





      dormDetail: {
        loading: "Жүктелуде...",
        errorLoad: "Тұрғын үй туралы деректерді жүктеу кезінде қате.",
        notFound: "Тұрғын үй табылмады.",
        defaultDescription:
          "Университеттің басты оқу ғимаратына жақын орналасқан дәстүрлі коридорлы типтегі студенттік жатақхана.",
        leftArrow: "<",
        rightArrow: ">",
        mainInfoTitle: "Негізгі ақпарат",
        amenitiesTitle: "Жайлылықтар",
        applyTitle: "Қазір өтінім қалдырыңыз",
        applyButton: "Өтінім беру",
        mapLabel: "Карта {address}",
        addressMissing: "Мекенжай жоқ",
        phoneMissing: "+7 (747) 364 88 99",
        floors: "Ғимаратта: {count} қабат",
        cost: "{cost} тг",
        places: "{count} орын",
        amenities: {
          wifi: "Wi-Fi",
          canteen: "Асхана",
          library: "Кітапхана",
          gym: "Спортзалы",
          laundry: "Кір жуу орны",
          cleaning: "Тазалау",
          security: "Қорғау"
        }
      },




      webAssistant: {
        title: "Веб-ассистент",
        close: "×",
        closeTitle: "Жабу",
        emptyMessages: "Хабар жоқ",
        placeholder: "Сұрағыңызды енгізіңіз...",
        send: "➤",
        operatorButton: "Оператор шақыру",
        endButton: "Чатты аяқтау",
        chatEnded: "Чат аяқталды.",
        loadingError: "Хабарларды жүктеу кезінде қате.",
        sendError: "Хабарды жіберу сәтсіз аяқталды.",
        requestOperatorError: "Оператор шақыру сәтсіз аяқталды.",
        endChatError: "Чатты аяқтау мүмкін болмады.",
        fallbackMessage:
          "Сіздің сұрағыңыз күрделі! Оператор жақын арада қосылып, сізге көмектеседі.",
        operatorCalled: "Оператор шақырылды. Күте тұрыңыз..."
      },





      home: {
        bannerAlt: "Баннер",
        dormSectionTitle: "Біздің жатақханалар",
        defaultDormDescription: "Жаңа үлгідегі жайлылықтары бар жатақхана.",
        iconBed: "{count}",
        iconCanteen: "Асхана",
        iconLaundry: "Кір жуу орны",
        moreButton: "Толығырақ",
        faqTitle: "Жиі қойылатын сұрақтар",
        faq: [
          {
            question: "Тұрғын үйдің бағасына не кіреді?",
            answer:
              "Тұру, коммуналдық қызметтер, асхана мен душ бөлмесін пайдалану."
          },
          {
            question: "Қанша уақыт тұруға болады?",
            answer: "Оқу мерзімі бойы ережелерді сақтаған жағдайда."
          },
          {
            question: "Жатақханаға кім орналаса алады?",
            answer: "Өтінім берген және іріктеуден өткен студенттер."
          },
          {
            question: "Орналастыру қалай жүзеге асады?",
            answer:
              "Ордер беріліп, жалдау шарты жасалады. Тіркеу деканат арқылы рәсімделеді. Өз бетімен орналастыруға тыйым салынады."
          },
          {
            question: "Тұру ақысын қалай төлеуге болады?",
            answer:
              "Төлем университеттік төлем жүйесі немесе банк арқылы жүргізіледі."
          },
          {
            question: "Қандай ережелерді сақтау керек?",
            answer: "Үнсіздік, тазалық, көршілер мен мүлікке құрмет көрсету."
          },
          {
            question: "Ережелер бұзылғанда не болады?",
            answer:
              "Ескерту, айыппұл немесе қоныстандырудан шығару тәртіп бұзушылық деңгейіне байланысты."
          }
        ],
        downloadText: "Студенттік жатақхана туралы ережені жүктеу",
        downloadButton: "Жүктеу"
      },




      notifications: {
        title: "Хабарламалар",
        enableSound: "Дыбысты қосу",
        errorLoad: "Хабарламаларды жүктеу мүмкін болмады",
        noNotifs: "Хабарлама жоқ",
        openChat: "Чат",
        hide: "Жасыру",
      },






      userDashboard: {
        profileTitle: "Менің профилім",
        loadingProfile: "Жүктелуде...",
        errorProfile: "Профиль деректерін жүктеу мүмкін болмады",
        changePassword: "Құпия сөзді өзгерту",
        statusTitle: "Өтінім мәртебесі",
        noApplication: "Қазірше өтініш бермегенсіз. Өтінімді ",
        here: "мұнда",
        application: "Өтінім – ",
        approvedPayment:
          "Өтінім мақұлданды, төлем жасап, чек скриншотын жүктеңіз.",
        payAndUpload: "Төлем жасап, скриншот жүктеңіз",
        uploadScreenshot: "Скриншот жүктеу",
        editApplication: "Өтінімді өңдеу",
        loadingSettings: "Жүктелуде...",
        selectFilePrompt: "Файлды таңдаңыз",
        uploadSuccess: "Скриншот сәтті жүктелді.",
        uploadError: "Файлды жүктеу кезінде қате. Қайта көріңіз.",
        avatarManageTitle: "Аватарды басқару",
        deleteAvatar: "Аватарды жою",
        chooseNew: "Жаңа таңдау",
        close: "✕",
        changePasswordTitle: "Құпия сөзді өзгерту",
        oldPassword: "Ескі құпия сөз",
        newPassword: "Жаңа құпия сөз",
        confirmPassword: "Жаңа құпия сөзді растау",
        passwordFillAll: "Барлық өрістерді толтырыңыз.",
        passwordMismatch: "Құпия сөздер сәйкес емес.",
        passwordSuccess: "Құпия сөз өзгертілді.",
        passwordError:
          "Құпия сөзді өзгерту кезінде қате. Қайта көріңіз.",
        cancel: "Болдырмау",
        save: "Сақтау",
        editDisabledTitle: "Өңдеу мүмкін емес",
        editDisabledDesc:
          "Қазір өтінімді өңдеу қолжетімсіз. Әкімшілікпен хабарласыңыз.",
        okay: "Түсіндім",
        excelModalTitle: "Төлем чегін жүктеу",
        fileNotChosen: "Файл таңдалмады",
        fileChosen: "Таңдалған файл: {name}",
        chooseFile: "Файлды таңдау",
        requirementsTitle: "Файл талаптары",
        requirementsDesc: "Файл PDF форматында болуы керек",
        send: "Жіберу"
      },




      studentDormChat: {
        chatsTitle: "Чаттар",
        sync: {
          syncing: "Синхрондалып жатыр...",
          button: "Чаттарды синхрондау",
          success:
            "Синхрондалды. init_all: {initMsg}. cleanup: жойылды {count} чат.",
          error: "Синхрондау қатесі: {error}"
        },
        searchPlaceholder: "Іздеу...",
        noChats: "Чат жоқ",
        selectChatPrompt: "Әңгімелесу үшін чат таңдаңыз",
        noMessages: "Хабар жоқ",
        messagePlaceholder: "Хатыңызды енгізіңіз...",
        floorLabel: 'Қабат',
        roomLabel: "бөлме",
        commandant: "комендант",
      },
  };