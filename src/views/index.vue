<template>
  <div>
    <div class="2xl:col-span-9 lg:col-span-8 col-span-12 my-4">
      <Card bodyClass="p-4">
        <div class="grid md:grid-cols-4 col-span-1 gap-4">
          <div
            class="py-[18px] px-4 rounded-[6px]"
            v-for="(item, i) in statistics"
            :class="item.bg"
            :key="i"
          >
            <div class="flex items-center space-x-6 rtl:space-x-reverse">
              <div class="flex-1">
                <div
                  class="text-slate-800 dark:text-slate-300 text-sm mb-1 font-medium"
                >
                  {{ item.title }}
                </div>
                <div
                  class="text-slate-900 dark:text-white text-lg font-medium"
                >
                {{ item.count instanceof Array ? item.count.join(', ') : item.count }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <div>
      <div>
        <Card title="">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-medium ml-4 my-4"> Kullanımlar </h2>
            <button class="toggle-button" :class="{ active: isActive }" @click="toggleButton">
              {{ isActive ? 'Açık' : 'Kapalı' }}
            </button>
          </div>
          <div class="grid xl:grid-cols-3 grid-cols-1 gap-5">

            <Card title="Ram Kullanımı">
              <apexchart
                type="pie"
                height="300"
                :options="
                  this.$store.themeSettingsStore.isDark
                    ? ramPieChartDark.chartOptions
                    : ramPieChart.chartOptions
                "
                :series="ramPieChart.series"
              ></apexchart>
              <div class="usage-item">
                <div class="usage-value">Ram Kullanımı: % {{ ramUsagePercent }}</div>
              </div>
            </Card>

            <Card title="Cpu Kullanımı (%)">
              <apexchart
                type="area"
                height="350"
                :options="
                  this.$store.themeSettingsStore.isDark
                    ? cpuAreaDark.chartOptions
                    : cpuArea.chartOptions
                "
                :series="cpuArea.series"
              />
            </Card>

            <Card title="Disk Kullanımı">
              <apexchart
                type="pie"
                height="300"
                :options="
                  this.$store.themeSettingsStore.isDark
                    ? diskPieChartDark.chartOptions
                    : diskPieChart.chartOptions
                "
                :series="diskPieChart.series"
              ></apexchart>
              <div class="usage-item">
                <div class="usage-value">Disk Kullanımı: % {{ diskUsagePercent }}</div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>


<script>
  // Import Card component and other required modules
  import Card from "@/components/Card";
  import os from 'os';
  const si = require('systeminformation');
  
  export default{
    name: 'home2',
    components: {
      Card,
    },
    data() {
      return {
        // Initialize data properties
        osInfo: '',
        cpuInfo: '',
        ramInfo: '',
        storageInfo: '',
        gpuInfo: '',
        screenResolution: '',
        connectionStatus: '',
        ipAddress: [],
        hostName: '',
        macAddress: [],
        ramUsagePercent: 50,
        diskUsagePercent: 50,
        isActive: false,
        intervalId: null,

        // RAM Usage Pie Chart data and options
        ramPieChart: {
          series: [50,50],

          chartOptions: {
            labels: ["Kullanılan", "Boş"],
            dataLabels: {
              enabled: true,
            },

            colors: ["#F1595C", "#50C793"],
            legend: {
              position: "bottom",
              fontSize: "16px",
              fontFamily: "Inter",
              fontWeight: 400,
              labels: {
                colors: "#475569",
              },
              markers: {
                width: 6,
                height: 6,
                offsetY: -1,
                offsetX: -5,
                radius: 12,
              },
              itemMargin: {
                horizontal: 10,
                vertical: 0,
              },
            },

            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            stroke: {
              colors: "transparent",
            },
          },
        },

        ramPieChartDark: {
          series: [50,50],

          chartOptions: {
            labels: ["Kullanılan", "Boş"],
            dataLabels: {
              enabled: true,
            },

            colors: ["#F1595C", "#50C793"],
            legend: {
              position: "bottom",
              fontSize: "16px",
              fontFamily: "Inter",
              fontWeight: 400,
              labels: {
                colors: "#CBD5E1",
              },
              markers: {
                width: 6,
                height: 6,
                offsetY: -1,
                offsetX: -5,
                radius: 12,
              },
              itemMargin: {
                horizontal: 10,
                vertical: 0,
              },
            },

            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            stroke: {
              colors: "transparent",
            },
          },
        },

        // Disk Usage Pie Chart data and options
        diskPieChart: {
          series: [50,50],

          chartOptions: {
            labels: ["Kullanılan", "Boş"],
            dataLabels: {
              enabled: true,
            },

            colors: ["#F1595C", "#50C793"],
            legend: {
              position: "bottom",
              fontSize: "16px",
              fontFamily: "Inter",
              fontWeight: 400,
              labels: {
                colors: "#475569",
              },
              markers: {
                width: 6,
                height: 6,
                offsetY: -1,
                offsetX: -5,
                radius: 12,
              },
              itemMargin: {
                horizontal: 10,
                vertical: 0,
              },
            },

            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            stroke: {
              colors: "transparent",
            },
          },
        },

        diskPieChartDark: {
          series: [50,50],

          chartOptions: {
            labels: ["Kullanılan", "Boş"],
            dataLabels: {
              enabled: true,
            },

            colors: ["#F1595C", "#50C793"],
            legend: {
              position: "bottom",
              fontSize: "16px",
              fontFamily: "Inter",
              fontWeight: 400,
              labels: {
                colors: "#CBD5E1",
              },
              markers: {
                width: 6,
                height: 6,
                offsetY: -1,
                offsetX: -5,
                radius: 12,
              },
              itemMargin: {
                horizontal: 10,
                vertical: 0,
              },
            },

            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            stroke: {
              colors: "transparent",
            },
          },
        },

        // CPU Usage Area Chart data and options
        cpuArea: {
          series: [
            {
              data: [50,50],
            },
          ],
          chartOptions: {
            chart: {
              toolbar: {
                show: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            colors: ["#4669FA"],
            tooltip: {
              theme: "dark",
            },
            grid: {
              show: true,
              borderColor: "#E2E8F0",
              strokeDashArray: 10,
              position: "back",
            },
            fill: {
              type: "gradient",
              colors: "#4669FA",
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.5,
                stops: [0, 100, 0],
              },
            },
            yaxis: {
              min: 0,
              max: 100,
              labels: {
                style: {
                  colors: "#475569",
                  fontFamily: "Inter",
                },
              },
            },

            xaxis: {
              categories: [
              ],
              labels: {
                show:false,
                style: {
                  colors: "#475569",
                  fontFamily: "Inter",
                },
              },
            },
            padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        cpuAreaDark: {
          series: [
            {
              data: [50,50],
            },
          ],
          chartOptions: {
            chart: {
              toolbar: {
                show: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            colors: ["#4669FA"],
            tooltip: {
              theme: "dark",
            },
            grid: {
              show: true,
              borderColor: "#334155",
              strokeDashArray: 10,
              position: "back",
            },
            fill: {
              type: "gradient",
              colors: "#4669FA",
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.5,
                stops: [50, 100, 0],
              },
            },
            yaxis: {
              min: 0,
              max: 100,
              labels: {
                style: {
                  colors: "#475569",
                  fontFamily: "Inter",
                },
              },
            },
            xaxis: {
              categories: [
              ],
              labels: {
                show: false,
                style: {
                  colors: "#CBD5E1",
                  fontFamily: "Inter",
                },
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
            },
            padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },

        // Array to hold statistics data
        statistics: [
        {
          title: "İşletim Sistemi",
          count: this.osInfo,
          bg: "bg-[#E5F9FF] dark:bg-slate-900	",
        },
        {
          title: "Hostname",
          count: this.hostName,
          bg: "bg-[#EAE5FF] dark:bg-slate-900	",
        },
        {
          title: "İp Adresi",
          count: this.ipAddress,
          bg: "bg-[#FFEDE5] dark:bg-slate-900	",
        },
        {
          title: "Mac Adresi",
          count: this.macAddress,
          bg: "bg-[#E5FFEF] dark:bg-slate-900	",
        }
        ],
      }
    },
    mounted() {
      // Update system information on mount
      this.updateSystemInfo();
    },
    // Watcher function for the 'isActive' data property
    // This function is called whenever the value of 'isActive' changes
    watch: {
      isActive: function (newVal, oldVal) {
        // If the new value of 'isActive' is true, start calling the 3 functions every 5 seconds
        if (newVal === true) {
          this.intervalId = setInterval(() => {
            this.getRamUsage();
            this.getCpuUsage();
            this.getDiskUsage();
          }, 5000)
        } 
        // If the new value of 'isActive' is false, stop calling the functions by clearing the interval
        else {
          clearInterval(this.intervalId)
        }
      }
    },
    methods: {
      // Get RAM Usage
      getRamUsage() {
        si.mem().then(data => {
          let usedRam = parseInt(data.used / 1024 / 1024);
          let totalRam = parseInt(data.total / 1024 / 1024);
          let emptyRam = totalRam - usedRam;
          this.ramUsagePercent = ((usedRam / totalRam) * 100).toFixed(2);
          // Update chart data
          this.ramPieChart.series = [usedRam, emptyRam];
          this.ramPieChartDark.series = [usedRam, emptyRam];
        }).catch(error => console.error(error));
      },

      // Get CPU Usage
      getCpuUsage() {
        si.currentLoad().then(data => {
          let usedCpu = parseInt(data.currentLoad);
          // Check and limit the number of data points in the chart
          if (this.cpuArea.series[0].data.length > 50) {
            // Remove the first data point
            this.cpuArea.series[0].data.shift();
          }
          // Update chart data
          this.cpuArea.series[0].data.push(usedCpu);
        }).catch(error => console.error(error));
      },

      // Get Disk Usage
      getDiskUsage() {
        si.fsSize().then(data => {
          let usedDisk = parseInt(data[0].used / 1024 / 1024 / 1024);
          let totalDisk = parseInt(data[0].size / 1024 / 1024 / 1024);
          let emptyDisk = totalDisk - usedDisk;
          this.diskUsagePercent = ((usedDisk / totalDisk) * 100).toFixed(2);
          // Update chart data
          this.diskPieChart.series = [usedDisk, emptyDisk];
          this.diskPieChartDark.series = [usedDisk, emptyDisk];
        }).catch(error => console.error(error));
      },

      // Update System Information
      updateSystemInfo() {
        this.getOsInfo();
        this.getIpAddress();
        this.getHostName();
        this.getMacAddress();
        this.setStatistics();
      },

      // Get Operating System Info
      getOsInfo() {
        this.osInfo = os.type();
      },

      // Get IP Address
      getIpAddress() {
        const interfaces = os.networkInterfaces();
        const addresses = [];

        for (const name of Object.keys(interfaces)) {
          for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
              addresses.push(iface.address);
            }
          }
        }
        this.ipAddress = addresses;

      },

      // Get Hostname
      getHostName() {
        this.hostName = os.hostname();
      },

      // Get MAC Address
      getMacAddress() {
        const interfaces = os.networkInterfaces();
        const macAddresses = [];
        const macSet = new Set();

        for (const name of Object.keys(interfaces)) {
          for (const iface of interfaces[name]) {
            if (iface.mac && iface.mac !== '00:00:00:00:00:00' && !macSet.has(iface.mac)) {
              macAddresses.push(iface.mac);
              macSet.add(iface.mac);
            }
          }
        }
        this.macAddress = macAddresses;
      },

      // Set Statistics
      setStatistics(){
        this.statistics[0].count = this.osInfo;
        this.statistics[1].count = this.hostName;
        this.statistics[2].count = this.ipAddress;
        this.statistics[3].count = this.macAddress;
      },

      // Toggle button to show/hide details
      toggleButton() {
        this.isActive = !this.isActive;
      }
    },
  }
</script>


<style scoped>

  .usage-item {
    padding: 20px;
    text-align: center;
  }

  .usage-value {
    font-size: 18px;
  }

  .toggle-button {
  background-color: #ccc;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-button.active {
  background-color: #007bff;
}

</style>