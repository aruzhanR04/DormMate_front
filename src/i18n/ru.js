export default {
    adminDeleteModal: {
      close: "✕",
      title: "Удаление студента",
      confirm: "Вы действительно хотите удалить администратора {name} (s: {s})?",
      cancel: "Отмена",
      delete: "Удалить",
    },
    
    applicationsDistributePage: {
        title: "Заявки",
        btnAllApplications: "Все заявки",
        btnDistributeStudents: "Распределить студентов",
        approvedRequests: {
          title: "Одобренные заявки",
          empty: "Нет заявок",
        },
        search: {
          placeholder: "Поиск...",
        },
        filter: {
          label: "Фильтр",
          gender: {
            title: "По полу",
            male: "Мужчины",
            female: "Женщины",
          },
          roomStatus: {
            title: "Статус заселения",
            assigned: "Назначена комната",
            unassigned: "Без комнаты",
          },
          reset: "Сбросить фильтры",
        },
        studentCard: {
          test: "Тест",
          gender: {
            M: "Муж.",
            F: "Жен.",
          },
          assignedIn: "Заселен в: {dorm}, комн. {room}",
          assignedInNoDormName: "Заселен в: комн. {room}",
          notAssigned: "Не заселен",
        },
        dorms: {
          loading: "Загрузка...",
          empty: "Общежитий не найдено",
        },
        floors: {
          empty: "Этажи не найдены",
          floor: "{floor} этаж",
        },
        rooms: {
          empty: "Комнаты не найдены",
          capacity: "{capacity}-местная",
          freeSpots: "{count} свободных мест",
          noOccupants: "— Нет заселённых студентов",
        },
        bottomActions: {
          sendOrders: "Разослать ордера",
          distributeGroups: "Автоматически распределить по группам",
        },
        icons: {
          alt: {
            refresh: "Обновить",
            search: "Поиск",
            filter: "Фильтр",
            delete: "Удалить",
          },
        },
      },


      adminChatPage: {
        students: "Студенты",
        searchPlaceholder: "Поиск...",
        noChats: "Нет чатов",
        chatWith: "Студент {s}",
        noMessages: "Нет сообщений",
        inputPlaceholder: "Введите ваше сообщение...",
        selectStudent: "Выберите студента для переписки",
        icons: {
          alt: {
            search: "Поиск",
            send: "Отправить сообщение",
          },
        },
      },



      adminCreateModal: {
        close: "✕",
        title: "Добавить администратора",
        labels: {
          s: "ID (s):",
          first_name: "Имя:",
          last_name: "Фамилия:",
          middle_name: "Отчество:",
          email: "Почта:",
          phone_number: "Номер телефона:",
          birth_date: "Дата рождения:",
          gender: "Пол:",
          role: "Роль:",
          password: "Пароль:",
        },
        genderOptions: {
          "": "Выберите...",
          M: "Мужской",
          F: "Женский",
        },
        roleOptions: {
          "": "Выберите роль",
          SUPER: "Главный администратор",
          OP: "Оператор",
          REQ: "Администратор по работе с заявками",
          COM: "Комендант",
        },
        buttons: {
          cancel: "Отмена",
          save: "Добавить",
        },
        messages: {
          success: "Администратор добавлен",
          error: "Ошибка при добавлении",
        },
      },




      adminDormChatPage: {
        headerListTitle: "Чаты общежитий",
        searchPlaceholder: "Поиск...",
        noChats: "Нет чатов",
        chatHeaderDorm: "Чат: Общежитие № {dormID}",
        chatHeaderFloor: "Чат: Этаж {floor} (общежитие № {dormID})",
        noMessages: "Нет сообщений",
        inputPlaceholder: "Введите ваше сообщение...",
        selectChat: "Выберите чат для переписки",
        roomLabel: "комната",
        commandant: "комендант",
        floorLabel:"Этаж",
        icons: {
          alt: {
            search: "Поиск",
            send: "Отправить сообщение",
          },
        },
      },




      adminDormitoriesPage: {
        title: "Управление общежитиями",
        buttons: {
          add: "Добавить общежитие",
        },
        messages: {
          loadError: "Ошибка при загрузке списка общежитий",
          statsError: "Не удалось загрузить статистику комнат",
          deleteSuccess: "Общежитие успешно удалено",
          deleteError: "Ошибка при удалении общежития",
        },
        table: {
          headers: {
            name: "Название",
            places: "Мест",
            roomsFor2: "Комнаты на 2",
            roomsFor3: "Комнаты на 3",
            roomsFor4: "Комнаты на 4",
            cost: "Стоимость",
            actions: "Операции",
          },
          empty: "Нет данных для отображения.",
        },
        pagination: {
          prev: "<",
          next: ">",
        },
        modals: {
          add: "Добавить общежитие",
          edit: "Изменить общежитие",
          view: "Просмотреть общежитие",
          delete: "Удалить общежитие",
        },
        icons: {
          alt: {
            view: "Просмотр",
            edit: "Изменение",
            delete: "Удалить",
          },
        },
      },





      adminDormitoryAddModal: {
        close: "✕",
        title: "Добавить общежитие",
        labels: {
          name: "Название:",
          total_places: "Количество мест:",
          cost: "Цена:",
          address: "Адрес:",
          description: "Описание:",
          images: "Выбрать фотографии:",
          roomsSection: "Комнаты",
          photosSection: "Фотографии",
          room_number: "Номер комнаты:",
          room_capacity: "Вместимость:",
          name_ru: "Название (русский)",
          name_kk: "Название (қазақша)",
          name_en: "Название (English)",
          description_ru: "Описание (русский)",
          description_kk: "Описание (қазақша)",
          description_en: "Описание (English)",
        },
        placeholders: {
          room_number: "101, 102A и т.д.",
          room_capacity: "2, 3 или 4",
        },
        buttons: {
          addRoom: "+ Добавить ещё одну комнату",
          save: "Сохранить",
          cancel: "Отмена",
          removeFile: "Удалить этот файл",
          removeRoom: "Удалить эту комнату",
        },
        messages: {
          fillDorm: "Пожалуйста, заполните все обязательные поля общежития.",
          fillRooms: "Все комнаты должны иметь номер и вместимость.",
          success: "Общежитие, комнаты и фотографии успешно добавлены.",
          error: "Ошибка при добавлении общежития/комнат/фотографий.",
        },
      },




      adminDormitoryDeleteModal: {
        close: "✕",
        title: "Удаление общежития",
        confirm: "Вы действительно хотите удалить общежитие «{name}»?",
        buttons: {
          cancel: "Отмена",
          delete: "Удалить",
        },
      },






      adminDormitoryEditModal: {
        title: "Редактировать общежитие",
        close: "✕",
        labels: {
          name_ru: "Название (русский)",
          name_kk: "Название (қазақша)",
          name_en: "Название (English)",
          address: "Адрес",
          total_places: "Мест",
          cost: "Цена за место (тг)",
          description_ru: "Описание (русский)",
          description_kk: "Описание (қазақша)",
          description_en: "Описание (English)",
          photosSection: "Фотографии",
          images: "Управление изображениями",
          roomsSection: "Комнаты",
          room_number: "Номер комнаты",
          room_capacity: "Вместимость"
        },
        buttons: {
          save: "Сохранить",
          cancel: "Отмена",
          addRoom: "Добавить комнату",
          removeRoom: "Удалить комнату",
          removeFile: "Удалить файл"
        },
        messages: {
          loadError: "Не удалось загрузить данные общежития.",
          fillDorm: "Пожалуйста, заполните все обязательные поля общежития.",
          fillDescription: "Пожалуйста, заполните описания на всех языках.",
          fillRooms: "Пожалуйста, укажите номер и вместимость каждой комнаты.",
          success: "Изменения успешно сохранены.",
          error: "Ошибка при сохранении изменений. Попробуйте ещё раз."
        }
      },




      adminDormitoryViewModal: {
        close: "✕",
        title: "Просмотр общежития",
        errorLoad: "Ошибка при загрузке данных общежития.",
        labels: {
          name: "Название:",
          address: "Адрес:",
          description: "Описание:",
          total_places: "Мест всего:",
          cost: "Стоимость:",
          imagesSection: "Фотографии",
        },
        buttons: {
          close: "Закрыть",
        },
        imageAlt: "Фото {id}",
      },




      adminEditModal: {
        close: "✕",
        title: "Редактировать администратора",
        labels: {
          s: "ID (s):",
          first_name: "Имя:",
          last_name: "Фамилия:",
          middle_name: "Отчество:",
          email: "Почта:",
          phone_number: "Номер телефона:",
          birth_date: "Дата рождения:",
          gender: "Пол:",
          role: "Роль:",
        },
        genderOptions: {
          "": "Выберите...",
          M: "Мужской",
          F: "Женский",
        },
        roleOptions: {
          "": "Выберите роль",
          SUPER: "Главный администратор",
          OP: "Оператор",
          REQ: "Администратор по работе с заявками",
        },
        buttons: {
          cancel: "Отмена",
          save: "Сохранить",
        },
        messages: {
          success: "Изменения сохранены",
          error: "Ошибка при сохранении",
        },
      },



      adminListPage: {
        title: "Администраторы",
        buttons: {
          add: "Добавить администратора",
        },
        searchPlaceholder: "Поиск...",
        table: {
          headers: {
            avatar: "Фото",
            s: "S",
            first_name: "Имя",
            last_name: "Фамилия",
            middle_name: "Отчество",
            role: "Роль",
            actions: "Операции",
          },
          empty: "Нет данных для отображения.",
        },
        pagination: {
          page: "{page}",
        },
        icons: {
          alt: {
            search: "Поиск",
            edit: "Редактировать",
            view: "Просмотр",
            delete: "Удалить",
          },
        },
      },




      adminNotifications: {
        title: "Уведомления от студентов",
        errors: {
          unauthorized: "Не авторизовано для админа.",
          loadError: "Ошибка при загрузке уведомлений.",
        },
        empty: "Нет новых уведомлений",
        buttons: {
          hide: "Скрыть",
        },
      },



      adminPanel: {
        header: {
          dormChats: "Чаты общежитий",
          chats: "Чаты",
        },
        title: "Админ панель",
        cards: {
          students: {
            title: "Студенты",
            desc: "Зарегистрировано студентов",
            btn: "Управление",
          },
          dormitories: {
            title: "Общежития",
            desc: "Общежитий в системе",
            btn: "Управление",
          },
          applications: {
            title: "Заявки",
            desc: "Заявок на рассмотрении",
            btn: "Управление",
          },
        },
        stats: {
          loading: "",
        },
      },




      adminStudentsPage: {
        title: "Управление студентами",
        buttons: {
          add: "Добавить студента",
          import: "Импорт Excel",
          export: "Экспорт Excel",
        },
        searchPlaceholder: "Поиск...",
        table: {
          headers: {
            avatar: "Фото",
            s: "S",
            first_name: "Имя",
            last_name: "Фамилия",
            middle_name: "Отчество",
            course: "Курс",
            actions: "Операции",
          },
          empty: "Нет данных для отображения.",
        },
        pagination: {
          page: "{page}",
        },
        importModal: {
          title: "Импорт данных из Excel",
          promptDefault: "Загрузите файл Excel",
          promptSuccess: "Файл выбран: {name}",
          checkbox: "Перезаписать существующие данные",
          requirementsTitle: "Требования к файлу",
          requirements:
            "Файл должен быть в формате XLSX или XLS\nПервая строка — заголовки столбцов\nОбязательные поля: ФИО, Пол, Курс",
          templateLink: "Скачать шаблон файла",
          buttons: {
            cancel: "Отмена",
            save: "Сохранить",
          },
        },
        messages: {
          loadError: "Ошибка при загрузке данных",
          noFile: "Выберите файл для загрузки",
          uploadSuccess: "Данные успешно загружены и обновлены",
          uploadError: "Ошибка при загрузке файла",
        },
        icons: {
          alt: {
            search: "Поиск",
            view: "Просмотр",
            edit: "Редактировать",
            delete: "Удалить",
            importDefault: "Импорт Excel",
            importActive: "Файл выбран",
          },
        },
      },





      adminSidebar: {
        menu: {
          dashboard: "Панель",
          students: "Студенты",
          dormitories: "Общежития",
          applications: "Заявки",
          admins: "Администраторы",
          evidenceTypes: "Категории справок",
        },
      },





      adminStudentAddModal: {
        close: "✕",
        title: "Добавить студента",
        labels: {
          s: "ID (s):",
          first_name: "Имя:",
          last_name: "Фамилия:",
          middle_name: "Отчество:",
          email: "Email:",
          birth_date: "Дата рождения:",
          phone_number: "Телефон:",
          gender: "Пол:",
          course: "Курс:",
          region: "Область:",
          password: "Пароль:",
        },
        genderOptions: {
          "": "Выберите...",
          M: "Мужской",
          F: "Женский",
        },
        regionPlaceholder: "Выберите регион",
        buttons: {
          save: "Добавить",
          cancel: "Отмена",
        },
      },






      adminStudentDeleteModal: {
        close: "✕",
        title: "Удаление студента",
        confirm: "Вы действительно хотите удалить студента «{last} {first}» (s: {s})?",
        buttons: {
          cancel: "Отмена",
          delete: "Удалить",
        },
      },





      adminStudentEditModal: {
        close: "✕",
        title: "Редактирование студента",
        labels: {
          s: "S:",
          first_name: "Имя:",
          last_name: "Фамилия:",
          middle_name: "Отчество:",
          email: "Email:",
          phone_number: "Телефон:",
          birth_date: "Дата рождения:",
          course: "Курс:",
          region: "Область:",
          gender: "Пол:",
        },
        genderOptions: {
          "": "Выберите",
          M: "М",
          F: "Ж",
        },
        regionPlaceholder: "Выберите регион",
        buttons: {
          cancel: "Отмена",
          save: "Сохранить",
        },
        messages: {
          saveSuccess: "Данные успешно сохранены.",
          saveError: "Произошла ошибка при сохранении данных.",
        },
      },






      adminStudentsPage: {
        title: "Управление студентами",
        buttons: {
          add: "Добавить студента",
          import: "Импорт Excel",
          export: "Экспорт Excel",
        },
        searchPlaceholder: "Поиск...",
        table: {
          headers: {
            avatar: "Фото",
            s: "S",
            first_name: "Имя",
            last_name: "Фамилия",
            middle_name: "Отчество",
            course: "Курс",
            actions: "Операции",
          },
          empty: "Нет данных для отображения.",
        },
        pagination: {
          prev: "<",
          next: ">",
          page: "{page}",
        },
        importModal: {
          title: "Импорт данных из Excel",
          promptDefault: "Загрузите файл Excel",
          promptSuccess: "Файл выбран: {name}",
          checkbox: "Перезаписать существующие данные",
          requirementsTitle: "Требования к файлу",
          requirements:
            "Файл должен быть в формате XLSX или XLS\nПервая строка — заголовки столбцов\nОбязательные поля: ФИО, Пол, Курс",
          templateLink: "Скачать шаблон файла",
          buttons: {
            cancel: "Отмена",
            save: "Сохранить",
          },
        },
        messages: {
          loadError: "Ошибка при загрузке данных",
          noFile: "Сначала выберите файл",
          uploadSuccess: "Данные успешно загружены и обновлены",
          uploadError: "Ошибка при загрузке файла",
        },
        icons: {
          alt: {
            search: "Поиск",
            view: "Просмотр",
            edit: "Редактировать",
            delete: "Удалить",
            importDefault: "Импорт Excel",
            importActive: "Файл выбран",
          },
        },
      },




      adminStudentViewModal: {
        close: "✕",
        title: "Просмотр студента",
        labels: {
          s: "S:",
          first_name: "Имя:",
          last_name: "Фамилия:",
          middle_name: "Отчество:",
          email: "Email:",
          phone_number: "Телефон:",
          birth_date: "Дата рождения:",
          course: "Курс:",
          region: "Область:",
          gender: "Пол:",
        },
        placeholder: "-",
        buttons: {
          close: "Закрыть",
        },
      },




      adminViewModal: {
        close: "✕",
        title: "Просмотр администратора",
        labels: {
          s: "ID (s):",
          first_name: "Имя:",
          last_name: "Фамилия:",
          middle_name: "Отчество:",
          email: "Почта:",
          phone_number: "Номер телефона:",
          birth_date: "Дата рождения:",
          gender: "Пол:",
          role: "Роль:",
        },
        genderMap: {
          M: "Мужской",
          F: "Женский",
          "": "",
        },
        roleOptions: {
          SUPER: "Главный администратор",
          OP: "Оператор",
          REQ: "Администратор по работе с заявками",
          "": "",
        },
        buttons: {
          close: "Закрыть",
        },
      },




      auditLog: {
        title: "Последние действия",
        loading: "Загрузка...",
        error: "Не удалось загрузить логи аудита",
        time: {
          justNow: "только что",
          minutesAgo: "{count} мин назад",
          hoursAgo: "{count} ч назад",
          dateOptions: { locale: "ru-RU" }
        },
        modelSeparator: "•",
      },




      evidenceEditPage: {
        loading: "Загрузка...",
        title: "Редактирование категории справок",
        fields: {
          name: "Название:",
          code: "Код:",
          data_type: "Тип данных:",
          priority: "Приоритет:",
          auto_fill_field: "Автозаполнение:",
          keywords: "Ключевые слова:",
        },
        dataTypeOptions: {
          file: "Файл",
          numeric: "Число",
        },
        keywordsPlaceholder: "Выберите ключевые слова…",
        buttons: {
          cancel: "Отмена",
          save: "Сохранить",
        },
        messages: {
          loadError: "Не удалось загрузить данные категории.",
          saveSuccess: "Категория успешно сохранена.",
          saveError: "Ошибка при сохранении категории.",
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
        title: "Категории справок",
        buttons: {
          keywords: "Ключевые слова",
          add: "Добавить категорию"
        },
        table: {
          headers: {
            id: "ID",
            name: "Название",
            code: "Код",
            data_type: "Тип",
            priority: "Приоритет",
            auto_fill_field: "Автозаполнение",
            keywords: "Ключевые слова",
            actions: "Операции"
          },
          empty: "Нет данных для отображения."
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
          title: "Подтвердите удаление",
          confirm: "Вы уверены, что хотите удалить категорию «{name}»?",
          buttons: {
            cancel: "Отмена",
            delete: "Удалить"
          }
        },
        viewModal: {
          title: "Просмотр категории",
          fields: {
            id: "ID:",
            name: "Название:",
            code: "Код:",
            data_type: "Тип:",
            priority: "Приоритет:",
            auto_fill_field: "Автозаполнение:",
            keywords: "Ключевые слова:"
          },
          buttons: {
            close: "Закрыть"
          }
        },
        editModal: {
          title: "Редактировать категорию",
          fields: {
            name: "Название",
            code: "Код",
            data_type: "Тип",
            priority: "Приоритет",
            auto_fill_field: "Автозаполнение",
            keywords: "Ключевые слова"
          },
          dataTypeOptions: {
            file: "Файл",
            numeric: "Integer"
          },
          buttons: {
            cancel: "Отмена",
            save: "Сохранить"
          }
        },
        addModal: {
          title: "Добавить категорию",
          fields: {
            name: "Название",
            code: "Код",
            data_type: "Тип",
            priority: "Приоритет",
            auto_fill_field: "Автозаполнение",
            keywords: "Ключевые слова"
          },
          dataTypeOptions: {
            file: "Файл",
            numeric: "Integer"
          },
          buttons: {
            cancel: "Отмена",
            save: "Сохранить"
          }
        }
      },




      evidenceKeywordsPage: {
        title: "Ключевые слова",
        buttons: {
          add: "Добавить ключевое слово",
        },
        table: {
          headers: {
            id: "ID",
            keyword: "Ключевое слово",
            actions: "Операции",
          },
          empty: "Нет данных для отображения.",
        },
        pagination: {
          prev: "<",
          next: ">",
          page: "{page}",
        },
        addModal: {
          title: "Добавить ключевое слово",
          placeholder: "Введите ключевое слово...",
          buttons: {
            cancel: "Отмена",
            save: "Добавить",
          },
        },
        viewModal: {
          title: "Просмотр ключевого слова",
          fields: {
            id: "ID:",
            keyword: "Ключевое слово:",
          },
          buttons: {
            close: "Закрыть",
          },
        },
        editModal: {
          title: "Редактировать ключевое слово",
          buttons: {
            cancel: "Отмена",
            save: "Сохранить",
          },
        },
        deleteModal: {
          title: "Подтвердите удаление",
          confirm: "Вы уверены, что хотите удалить ключевое слово «{keyword}»?",
          buttons: {
            cancel: "Отмена",
            delete: "Удалить",
          },
        },
      },







      adminApplicationsDistributePage: {
        title: "Распределение студентов",
        tabs: {
          all: "Все заявки",
          distribute: "Распределить студентов",
          export: "Выгрузить Excel",
        },
        searchPlaceholder: "Поиск...",
        table: {
          headers: {
            id: "ID",
            student: "Студент",
            score: "GPA/ЕНТ",
            status: "Статус",
            payment: "Оплата",
            actions: "Операции",
          },
          empty: "Нет данных для отображения.",
        },
        pagination: {
          prev: "<",
          next: ">",
        },
        bottomButtons: {
          autoSelect: "Автоматический отбор",
          notify: "Уведомить студентов",
          notifying: "Отправка...",
        },
        confirmModal: {
          approve: {
            title: "Одобрение заявки",
            question: "Вы действительно хотите одобрить заявку?",
          },
          reject: {
            title: "Отклонение заявки",
            question: "Вы действительно хотите отклонить заявку?",
          },
          buttons: {
            cancel: "Отмена",
            confirm: "Далее",
          },
        },
        detailsModal: {
          title: "Заявка ID: {id}",
          fields: {
            student: "Студент",
            score: "GPA / ЕНТ",
            payment: "Оплата",
            evidences: "Справки",
            dorm: "Общежитие",
            status: "Статус",
          },
          evidenceActions: {
            view: "Просмотреть",
            accept: "Принять справку",
            reject: "Отклонить справку",
          },
          buttons: {
            close: "Закрыть",
            cancel: "Отмена",
          },
        },
        notificationModal: {
          title: "Информация",
          buttons: {
            close: "Закрыть",
          },
        },
      },




      syncChatsButton: {
        sync: "Синхронизировать чаты",
        syncing: "Синхронизируем...",
        messageInitCleanup: "init_all: {initMsg}. cleanup: удалено {deleted} чатов.",
        error: "Ошибка синхронизации: {error}",
      },




      footer: {
        contactsTitle: "Контакты",
        address: "ул. Жандосова 55, Ауэзовский район\nАлматы, Казахстан, 050035",
        email: "dorm@narxoz.kz",
        phone: "+7 (747) 364 88 99",
        socialTitle: "Мы в соцсетях",
      },



      navbar: {
        home: "Главная",
        apply: "Подать заявку",
        editApplication: "Редактировать заявку",
        adminPanel: "Панель администратора",
        notifications: {
          studentTitle: "Уведомления",
          adminTitle: "Уведомления (Админ)",
          noNotifications: "Нет уведомлений"
        },
        profile: {
          profile: "Профиль",
          logout: "Выйти"
        },
        auth: {
          login: "Войти"
        },
        warning: {
          title: "Редактирование заявок отключено",
          message: "В данный момент редактирование заявок недоступно. Свяжитесь с администрацией.",
          ok: "Понятно"
        }
      },



      applicationStatus: {
        title: "Статус заявки",
        errorNoApplication: "Вы не подавали заявку на студенческий дом",
        statusApproved: "Заявка одобрена, внесите оплату и прикрепите скрин.",
        uploadSectionTitle: "Загрузите скриншот оплаты",
        uploadButton: "Загрузить",
        selectFileError: "Пожалуйста, выберите файл для загрузки",
        uploadSuccess: "Скриншот успешно загружен.",
        uploadError: "Ошибка при загрузке файла. Пожалуйста, попробуйте снова.",
        editApplication: "Редактировать заявку",
      },





      applicationPage: {
        title: "Заявка на заселение",
        description: "Заполните форму и предоставьте необходимые документы для подачи заявки на проживание в общежитии",
        firstName: "Имя",
        lastName: "Фамилия",
        course: "Курс",
        birthDate: "Дата рождения",
        gender: "Пол",
        parentPhone: "Телефон родителей",
        selectParentPhone: "Введите номер родителей",
        priceRange: "Ценовой диапазон",
        selectPrice: "Выберите стоимость",
        entResultLabel: {
          freshman: "Балл ЕНТ",
          other: "GPA"
        },
        entPlaceholder: "Будет заполнено автоматически",
        entCertificate: "Сертификат ЕНТ (PDF)",
        uploadDocsBtn: "Загрузить остальные документы",
        submitBtn: "Подать заявку",
        modal: {
          title: "Загрузка документов",
          helpFreshman: "Загрузка «Сертификата ЕНТ» уже сделана выше. Вы можете добавить остальные документы.",
          helpOther: "Если у вас есть какие-либо документы (справки и т.п.), можете прикрепить их здесь.",
          footer: "Недостающие файлы можно будет прикрепить позже.",
          closeBtn: "Закрыть"
        },
        fileInputReplace: "Заменить",
        fileInputUpload: "Загрузить",
        fileInputIcon: "📄"
      },




      editApplicationPage: {
        title: "Редактировать заявку",
        desc: "Внесите необходимые изменения и нажмите «Сохранить изменения»",
        labels: {
          firstName: "Имя",
          lastName: "Фамилия",
          course: "Курс",
          gender: "Пол",
          birthDate: "Дата рождения",
          parentPhone: "Телефон родителя",
          priceRange: "Ценовой диапазон",
          entResult: {
            label: "Балл ЕНТ",
            placeholder: "Будет заполнено при загрузке сертификата"
          },
          gpa: "GPA",
          uploadEnt: "Загрузить сертификат ЕНТ",
          editDocs: "Изменить документы",
          save: "Сохранить изменения",
          filesInApp: "Файлы в заявке:",
          close: "Закрыть"
        },
        notes: {
          ent: "Загрузите PDF сертификата, чтобы поле «Балл ЕНТ» было заполнено автоматически."
        }
      },


      testPage: {
        title: "Тест",
        loading: "Загрузка вопросов",
        loadError: "Ошибка при загрузке вопросов",
        errorPrefix: "Ошибка: {error}",
        thankYou: "Спасибо! Вы будете перенаправлены на страницу профиля",
        questionNotFound: "Вопрос не найден",
        progress: "Вопрос {current} из {total}",
        back: "Назад",
        next: "Далее",
        submitTest: "Отправить тест",
        alertIncomplete: "Пожалуйста, ответьте на все вопросы.",
        submitError: "Ошибка при отправке теста"
      },



      loginPage: {
        altLeft: "Персонаж слева",
        title: "Вход в систему",
        subtitleLine1: "Введите свои учетные данные для",
        subtitleLine2: "доступа к системе",
        errorAuth: "Ошибка авторизации",
        labelLogin: "Логин",
        placeholderLogin: "Введите ваш логин или номер телефона",
        labelPassword: "Пароль",
        placeholderPassword: "Введите ваш пароль",
        togglePasswordAlt: "показать/скрыть пароль",
        loginButton: "Войти",
        altRight: "Персонаж справа",
      },




      dormDetail: {
        loading: "Загрузка...",
        errorLoad: "Ошибка при загрузке данных общежития.",
        notFound: "Общежитие не найдено.",
        defaultDescription:
          "Традиционное студенческое общежитие коридорного типа, расположенное в непосредственной близости от главного учебного корпуса университета.",
        leftArrow: "<",
        rightArrow: ">",
        mainInfoTitle: "Основная информация",
        amenitiesTitle: "Удобства",
        applyTitle: "Подайте заявку прямо сейчас",
        applyButton: "Подать заявку",
        mapLabel: "Карта {address}",
        addressMissing: "Адрес отсутствует",
        phoneMissing: "+7 (747) 364 88 99",
        floors: "Этажей: {count}",
        cost: "{cost} тг",
        places: "{count} мест",
        amenities: {
          wifi: "Wi-Fi",
          canteen: "Столовая",
          library: "Библиотека",
          gym: "Спортзал",
          laundry: "Прачечная",
          cleaning: "Уборка",
          security: "Охрана"
        }
      },




      webAssistant: {
        title: "Веб-помощник",
        close: "×",
        closeTitle: "Закрыть",
        emptyMessages: "Нет сообщений",
        placeholder: "Введите вопрос...",
        send: "➤",
        operatorButton: "Вызвать оператора",
        endButton: "Завершить чат",
        chatEnded: "Чат завершён.",
        loadingError: "Ошибка при загрузке сообщений.",
        sendError: "Не удалось отправить сообщение.",
        requestOperatorError: "Не удалось вызвать оператора.",
        endChatError: "Не удалось завершить чат.",
        fallbackMessage:
          "Ваш вопрос сложный! Оператор скоро подключится и поможет вам.",
        operatorCalled: "Оператор вызван. Ожидайте..."
      },





      home: {
        bannerAlt: "Баннер",
        dormSectionTitle: "Наши общежития",
        defaultDormDescription: "Общежитие нового типа с удобствами.",
        iconBed: "{count}",
        iconCanteen: "Столовая",
        iconLaundry: "Прачечная",
        moreButton: "Подробнее",
        faqTitle: "Часто задаваемые вопросы",
        faq: [
          {
            question: "Что входит в стоимость проживания?",
            answer: "Проживание, коммунальные услуги, пользование кухней и душем."
          },
          {
            question: "Как долго можно проживать в Доме студентов?",
            answer: "На протяжении всего периода обучения при соблюдении правил."
          },
          {
            question: "Кто может получить место в общежитии?",
            answer: "Студенты, подавшие заявку и прошедшие отбор."
          },
          {
            question: "Как происходит заселение?",
            answer:
              "Выдаётся ордер и заключается договор найма. Прописка оформляется через деканат. Самовольное заселение запрещено."
          },
          {
            question: "Как я могу оплатить проживание?",
            answer:
              "Оплата производится через университетскую платёжную систему или банк."
          },
          {
            question: "Какие правила проживания я должен соблюдать?",
            answer: "Соблюдение тишины, чистоты, уважение к соседям и имуществу."
          },
          {
            question: "Что произойдёт при нарушении правил?",
            answer: "Предупреждение, штраф или выселение в зависимости от серьёзности."
          }
        ],
        downloadText: "Скачать Положение о доме студентов",
        downloadButton: "Скачать"
      },




      notifications: {
        title: "Уведомления",
        enableSound: "Включить звук",
        errorLoad: "Не удалось загрузить уведомления",
        noNotifs: "Нет уведомлений",
        openChat: "Чат",
        hide: "Скрыть",
      },





      userDashboard: {
        profileTitle: "Мой профиль",
        loadingProfile: "Загрузка...",
        errorProfile: "Не удалось загрузить данные профиля",
        changePassword: "Сменить пароль",
        statusTitle: "Статус заявки",
        noApplication: "Похоже, вы ещё не подали заявку. Вы можете подать её ",
        here: "здесь",
        application: "Заявка – ",
        approvedPayment: "Ваша заявка одобрена, внесите оплату и прикрепите сюда чек.",
        payAndUpload: "Внесите оплату и прикрепите скриншот",
        uploadScreenshot: "Загрузить скриншот",
        editApplication: "Редактировать заявку",
        loadingSettings: "Загрузка...",
        selectFilePrompt: "Пожалуйста, выберите файл для загрузки",
        uploadSuccess: "Скриншот успешно загружен.",
        uploadError: "Ошибка при загрузке файла. Попробуйте снова.",
        avatarManageTitle: "Управление аватаром",
        deleteAvatar: "Удалить аватар",
        chooseNew: "Выбрать новый",
        close: "✕",
        changePasswordTitle: "Сменить пароль",
        oldPassword: "Старый пароль",
        newPassword: "Новый пароль",
        confirmPassword: "Подтвердите новый пароль",
        passwordFillAll: "Пожалуйста, заполните все поля.",
        passwordMismatch: "Пароли не совпадают.",
        passwordSuccess: "Пароль успешно изменён.",
        passwordError: "Ошибка при изменении пароля. Попробуйте снова.",
        cancel: "Отмена",
        save: "Сохранить",
        editDisabledTitle: "Редактирование заявок отключено",
        editDisabledDesc:
          "В данный момент редактирование заявок недоступно. Свяжитесь с администрацией.",
        okay: "Понятно",
        excelModalTitle: "Загрузка чека об оплате",
        fileNotChosen: "Файл не выбран",
        fileChosen: "Файл выбран: {name}",
        chooseFile: "Выбрать файл",
        requirementsTitle: "Требования к файлу",
        requirementsDesc: "Файл должен быть в формате PDF",
        send: "Отправить"
      }, 





      studentDormChat: {
        chatsTitle: "Чаты",
        sync: {
          syncing: "Синхронизируем...",
          button: "Синхронизировать чаты",
          success:
            "Синхронизация выполнена. init_all: {initMsg}. cleanup: удалено {count} чатов.",
          error: "Ошибка синхронизации: {error}"
        },
        searchPlaceholder: "Поиск...",
        noChats: "Нет чатов",
        selectChatPrompt: "Выберите чат для переписки",
        noMessages: "Нет сообщений",
        messagePlaceholder: "Введите ваше сообщение...",
        floorLabel: 'Этаж',
        roomLabel: "комната",
        commandant: "комендант",
      },
      





  };